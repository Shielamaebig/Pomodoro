import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PomodoroSession, DaySessionsGroup } from '../types/session';
import type { GardenTree } from '../types/tree';
import { databaseService } from '../services/databaseService';

export interface DailyChartData {
  dayName: string; // 'Mon', 'Tue', etc.
  dateStr: string; // 'YYYY-MM-DD'
  focusMinutes: number;
  pomodoroCount: number;
}

export interface GardenPlant {
  id: string;
  stage: 'sprout' | 'seedling' | 'potted' | 'tree';
  emoji: string;
  label: string;
  pomodoroValue: number;
  date: string;
}

export const useStatsStore = defineStore('stats', () => {
  const sessions = ref<PomodoroSession[]>([]);
  const trees = ref<GardenTree[]>([]);
  const isLoaded = ref(false);

  const loadSessions = async () => {
    try {
      sessions.value = await databaseService.getSessions();
      trees.value = await databaseService.getGardenTrees();
    } catch (e) {
      console.warn('Failed to load sessions/trees:', e);
    } finally {
      isLoaded.value = true;
    }
  };

  const recordSession = async (session: PomodoroSession) => {
    sessions.value.unshift(session);
    await databaseService.saveSession(session);
  };

  const recordGardenTree = async (tree: GardenTree) => {
    trees.value.unshift(tree);
    await databaseService.saveGardenTree(tree);
  };

  // Helper date formatters
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Focus metrics today
  const todayFocusSeconds = computed(() => {
    const now = new Date();
    return sessions.value
      .filter((s) => s.sessionType === 'focus' && s.completed && isSameDay(new Date(s.endedAt), now))
      .reduce((acc, s) => acc + s.durationSeconds, 0);
  });

  const todayFocusMinutes = computed(() => Math.round(todayFocusSeconds.value / 60));

  const todayPomodoros = computed(() => {
    const now = new Date();
    return sessions.value.filter(
      (s) => s.sessionType === 'focus' && s.completed && isSameDay(new Date(s.endedAt), now)
    ).length;
  });

  // Week metrics (Current week starting Monday)
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const weekFocusSeconds = computed(() => {
    const startOfWeek = getStartOfWeek(new Date());
    return sessions.value
      .filter((s) => s.sessionType === 'focus' && s.completed && new Date(s.endedAt) >= startOfWeek)
      .reduce((acc, s) => acc + s.durationSeconds, 0);
  });

  const weekFocusMinutes = computed(() => Math.round(weekFocusSeconds.value / 60));

  const weekPomodoros = computed(() => {
    const startOfWeek = getStartOfWeek(new Date());
    return sessions.value.filter(
      (s) => s.sessionType === 'focus' && s.completed && new Date(s.endedAt) >= startOfWeek
    ).length;
  });

  // Weekly bar chart data (7 days Mon -> Sun)
  const weeklyChartData = computed<DailyChartData[]>(() => {
    const startOfWeek = getStartOfWeek(new Date());
    const days: DailyChartData[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek);
      current.setDate(startOfWeek.getDate() + i);
      const dateStr = current.toISOString().slice(0, 10);

      const daySessions = sessions.value.filter(
        (s) => s.sessionType === 'focus' && s.completed && isSameDay(new Date(s.endedAt), current)
      );

      const totalSec = daySessions.reduce((sum, s) => sum + s.durationSeconds, 0);

      days.push({
        dayName: dayNames[i],
        dateStr,
        focusMinutes: Math.round(totalSec / 60),
        pomodoroCount: daySessions.length,
      });
    }

    return days;
  });

  // Streaks calculation (Consecutive days with at least 1 completed focus session)
  const streaks = computed(() => {
    if (sessions.value.length === 0) return { current: 0, longest: 0 };

    // Get unique dates with at least 1 completed focus session
    const activeDates = Array.from(
      new Set(
        sessions.value
          .filter((s) => s.sessionType === 'focus' && s.completed)
          .map((s) => new Date(s.endedAt).toISOString().slice(0, 10))
      )
    ).sort().reverse();

    if (activeDates.length === 0) return { current: 0, longest: 0 };

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let currentStreak = 0;
    let checkDate = activeDates[0] === todayStr ? new Date() : (activeDates[0] === yesterdayStr ? yesterday : null);

    if (checkDate) {
      let d = new Date(checkDate);
      while (true) {
        const dStr = d.toISOString().slice(0, 10);
        if (activeDates.includes(dStr)) {
          currentStreak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Longest streak
    let longest = 0;
    let running = 0;
    for (let i = 0; i < activeDates.length; i++) {
      if (i === 0) {
        running = 1;
      } else {
        const prev = new Date(activeDates[i - 1]);
        const curr = new Date(activeDates[i]);
        const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          running++;
        } else {
          running = 1;
        }
      }
      if (running > longest) longest = running;
    }

    return {
      current: currentStreak,
      longest: Math.max(longest, currentStreak),
    };
  });

  // Grouped session history (Today, Yesterday, Date)
  const groupedHistory = computed<DaySessionsGroup[]>(() => {
    const groups: { [key: string]: DaySessionsGroup } = {};
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    for (const session of sessions.value) {
      const date = new Date(session.startedAt);
      const dateKey = date.toISOString().slice(0, 10);

      if (!groups[dateKey]) {
        let displayDate = date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        if (isSameDay(date, now)) displayDate = 'Today';
        else if (isSameDay(date, yesterday)) displayDate = 'Yesterday';

        groups[dateKey] = {
          date: dateKey,
          displayDate,
          totalFocusSeconds: 0,
          completedPomodoros: 0,
          sessions: [],
        };
      }

      groups[dateKey].sessions.push(session);
      if (session.sessionType === 'focus' && session.completed) {
        groups[dateKey].totalFocusSeconds += session.durationSeconds;
        groups[dateKey].completedPomodoros += 1;
      }
    }

    return Object.keys(groups)
      .sort()
      .reverse()
      .map((k) => groups[k]);
  });

  // Focus Garden Plants
  // Gamification:
  // 1 Pomodoro -> 🌱 Sprout
  // 2 Pomodoros -> 🌿 Seedling
  // 4 Pomodoros -> 🪴 Potted Plant
  // 8 Pomodoros -> 🌳 Mature Tree
  const gardenPlants = computed<GardenPlant[]>(() => {
    const plants: GardenPlant[] = [];

    // Derive plants per day based on completed pomodoros
    for (const group of groupedHistory.value) {
      let count = group.completedPomodoros;
      let plantIdx = 1;

      while (count >= 8) {
        plants.push({
          id: `${group.date}_tree_${plantIdx++}`,
          stage: 'tree',
          emoji: '🌳',
          label: 'Mature Oak',
          pomodoroValue: 8,
          date: group.displayDate,
        });
        count -= 8;
      }
      while (count >= 4) {
        plants.push({
          id: `${group.date}_potted_${plantIdx++}`,
          stage: 'potted',
          emoji: '🪴',
          label: 'Flourishing Plant',
          pomodoroValue: 4,
          date: group.displayDate,
        });
        count -= 4;
      }
      while (count >= 2) {
        plants.push({
          id: `${group.date}_seedling_${plantIdx++}`,
          stage: 'seedling',
          emoji: '🌿',
          label: 'Young Sapling',
          pomodoroValue: 2,
          date: group.displayDate,
        });
        count -= 2;
      }
      while (count >= 1) {
        plants.push({
          id: `${group.date}_sprout_${plantIdx++}`,
          stage: 'sprout',
          emoji: '🌱',
          label: 'Fresh Sprout',
          pomodoroValue: 1,
          date: group.displayDate,
        });
        count -= 1;
      }
    }

    return plants;
  });

  const todayTrees = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return trees.value.filter((t) => t.plantedAt.slice(0, 10) === today);
  });

  return {
    sessions,
    trees,
    todayTrees,
    isLoaded,
    loadSessions,
    recordSession,
    recordGardenTree,
    todayFocusMinutes,
    todayPomodoros,
    weekFocusMinutes,
    weekPomodoros,
    weeklyChartData,
    streaks,
    groupedHistory,
    gardenPlants,
  };
});
