import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TimerState, TimerMode, TimerStatus } from '../types/timer';
import type { PomodoroSession } from '../types/session';
import type { TreeSpecies, TreeStage, GardenTree } from '../types/tree';
import { useSettingsStore } from './settingsStore';
import { useTaskStore } from './taskStore';
import { useStatsStore } from './statsStore';
import { desktopService } from '../services/desktopService';
import { notificationService } from '../services/notificationService';
import router from '../router';
import confetti from 'canvas-confetti';

export const useTimerStore = defineStore('timer', () => {
  const settingsStore = useSettingsStore();
  const taskStore = useTaskStore();
  const statsStore = useStatsStore();

  // Internal reactive state
  const mode = ref<TimerMode>('focus');
  const status = ref<TimerStatus>('idle');
  const startedAt = ref<number | null>(null);
  const endsAt = ref<number | null>(null);
  const remainingSeconds = ref<number>(25 * 60);
  const completedPomodoros = ref<number>(0);
  const currentTreeSpecies = ref<TreeSpecies>('oak');

  // Growth stages:
  // 0–10%: Seed (0)
  // 10–30%: Sprout (1)
  // 30–55%: Small plant (2)
  // 55–80%: Young tree (3)
  // 80–99%: Large tree (4)
  // 100%: Completed tree (5)
  const currentTreeStage = computed<TreeStage>(() => {
    const p = progress.value;
    if (p >= 1) return 5;
    if (p >= 0.8) return 4;
    if (p >= 0.55) return 3;
    if (p >= 0.3) return 2;
    if (p >= 0.1) return 1;
    return 0;
  });

  // Timer interval handle
  let tickInterval: number | null = null;
  let currentSessionStartTime: string | null = null;

  // Duration in seconds based on current mode & settings
  const targetDurationSeconds = computed(() => {
    if (mode.value === 'focus') {
      return settingsStore.settings.focusDuration * 60;
    } else if (mode.value === 'shortBreak') {
      return settingsStore.settings.shortBreakDuration * 60;
    } else {
      return settingsStore.settings.longBreakDuration * 60;
    }
  });

  // Exported state object for cross-window sync
  const state = computed<TimerState>(() => ({
    mode: mode.value,
    status: status.value,
    startedAt: startedAt.value,
    endsAt: endsAt.value,
    remainingSeconds: remainingSeconds.value,
    totalDurationSeconds: targetDurationSeconds.value,
    completedPomodoros: completedPomodoros.value,
    currentTaskId: taskStore.activeTaskId,
    treeSpecies: currentTreeSpecies.value,
    treeStage: currentTreeStage.value,
  }));

  // Progress percentage (0.0 to 1.0)
  const progress = computed(() => {
    const total = targetDurationSeconds.value;
    if (total <= 0) return 0;
    const elapsed = total - remainingSeconds.value;
    return Math.min(1, Math.max(0, elapsed / total));
  });

  // Formatted MM:SS display
  const formattedTime = computed(() => {
    const mins = Math.floor(remainingSeconds.value / 60);
    const secs = remainingSeconds.value % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  });

  // Broadcast state to Tauri mini timer & tray
  const broadcastState = () => {
    desktopService.emitTimerState(state.value);
  };

  // Synchronize time from absolute timestamps
  const syncTimeFromTimestamp = () => {
    if (status.value === 'running' && endsAt.value !== null) {
      const remaining = Math.max(0, Math.ceil((endsAt.value - Date.now()) / 1000));
      remainingSeconds.value = remaining;

      if (remaining <= 0) {
        handleTimerCompletion();
      }
    }
    broadcastState();
  };

  const startTickLoop = () => {
    stopTickLoop();
    tickInterval = window.setInterval(() => {
      syncTimeFromTimestamp();
    }, 250);
  };

  const stopTickLoop = () => {
    if (tickInterval !== null) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  };

  // Set mode (focus, shortBreak, longBreak)
  const setMode = (newMode: TimerMode, autoRun = false) => {
    stopTickLoop();
    mode.value = newMode;
    status.value = 'idle';
    startedAt.value = null;
    endsAt.value = null;
    remainingSeconds.value = targetDurationSeconds.value;
    currentSessionStartTime = null;

    broadcastState();

    if (autoRun) {
      start();
    }
  };

  // Start timer
  const start = () => {
    const now = Date.now();
    startedAt.value = now;
    endsAt.value = now + remainingSeconds.value * 1000;
    status.value = 'running';
    if (!currentSessionStartTime) {
      currentSessionStartTime = new Date().toISOString();
      if (mode.value === 'focus') {
        const speciesList: TreeSpecies[] = ['oak', 'pine', 'cherry', 'maple', 'flowering'];
        currentTreeSpecies.value = speciesList[Math.floor(Math.random() * speciesList.length)];
      }
    }

    startTickLoop();
    broadcastState();

    // Auto-hide main desktop window & pop out floating focus widget
    if (mode.value === 'focus' && settingsStore.settings.autoHideOnFocusStart) {
      desktopService.showMiniTimer();
      desktopService.hideMainWindow();
    }
  };

  // Pause timer
  const pause = () => {
    if (status.value !== 'running') return;
    stopTickLoop();

    // Freeze remaining seconds accurately
    if (endsAt.value !== null) {
      remainingSeconds.value = Math.max(0, Math.ceil((endsAt.value - Date.now()) / 1000));
    }
    status.value = 'paused';
    endsAt.value = null;

    broadcastState();
  };

  // Resume timer
  const resume = () => {
    if (status.value !== 'paused') return;
    const now = Date.now();
    endsAt.value = now + remainingSeconds.value * 1000;
    status.value = 'running';

    startTickLoop();
    broadcastState();
  };

  // Reset current session to full duration
  const reset = () => {
    stopTickLoop();
    status.value = 'idle';
    startedAt.value = null;
    endsAt.value = null;
    remainingSeconds.value = targetDurationSeconds.value;
    currentSessionStartTime = null;

    broadcastState();
  };

  // Skip current session
  const skip = () => {
    advanceToNextSession(false);
  };

  // Finish session early (marks session as completed)
  const finishEarly = () => {
    handleTimerCompletion();
  };

  // Advance to next session
  const advanceToNextSession = (wasCompleted: boolean) => {
    stopTickLoop();

    const endedAtIso = new Date().toISOString();
    const duration = targetDurationSeconds.value - remainingSeconds.value;

    // Record session
    if (currentSessionStartTime && duration > 5) {
      const session: PomodoroSession = {
        id: 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        taskId: taskStore.activeTaskId,
        taskTitle: taskStore.activeTask?.title,
        sessionType: mode.value,
        startedAt: currentSessionStartTime,
        endedAt: endedAtIso,
        durationSeconds: Math.max(1, duration),
        completed: wasCompleted,
      };
      statsStore.recordSession(session);

      // Record tree to Garden if focus session
      if (mode.value === 'focus' && (wasCompleted || duration >= 60)) {
        const gardenTree: GardenTree = {
          id: 'tree_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          sessionId: session.id,
          species: currentTreeSpecies.value,
          stage: wasCompleted ? 5 : currentTreeStage.value,
          completed: wasCompleted,
          plantedAt: currentSessionStartTime,
          completedAt: endedAtIso,
          taskTitle: taskStore.activeTask?.title,
          durationMinutes: Math.round(Math.max(1, duration) / 60),
        };
        statsStore.recordGardenTree(gardenTree);
      }
    }

    // Determine next mode
    if (mode.value === 'focus') {
      if (wasCompleted) {
        completedPomodoros.value += 1;
        if (taskStore.activeTaskId) {
          taskStore.incrementTaskPomodoro(taskStore.activeTaskId);
        }
      }

      // Check if long break or short break
      const isLongBreak =
        completedPomodoros.value > 0 &&
        completedPomodoros.value % settingsStore.settings.longBreakInterval === 0;

      setMode(isLongBreak ? 'longBreak' : 'shortBreak', settingsStore.settings.autoStartBreaks);
    } else {
      // Break ended -> go to Focus
      setMode('focus', settingsStore.settings.autoStartFocus);
    }
  };

  // Handle timer completion when reaching 0
  const handleTimerCompletion = () => {
    stopTickLoop();
    remainingSeconds.value = 0;
    status.value = 'idle';

    const isFocus = mode.value === 'focus';

    // Play chime sound
    if (settingsStore.settings.notificationSound) {
      notificationService.playChime();
    }

    // Desktop notification
    if (settingsStore.settings.desktopNotifications) {
      if (isFocus) {
        const nextBreakType =
          (completedPomodoros.value + 1) % settingsStore.settings.longBreakInterval === 0
            ? 'long break'
            : 'short break';
        notificationService.notify('🌳 Focus Complete', `Great work. Time for a ${nextBreakType}.`);
      } else {
        notificationService.notify('☕ Break Complete', 'Ready for another focus session?');
      }
    }

    // Confetti celebration on screen for focus completion
    if (isFocus && typeof window !== 'undefined') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E24429', '#10B981', '#F59E0B', '#3B82F6'],
        });
      } catch {
        // Safe fallback
      }
    }

    advanceToNextSession(true);
  };

  // External action receiver from Mini Timer or Tray
  const handleAction = (msg: { action: string; mode?: TimerMode; taskId?: string | null }) => {
    switch (msg.action) {
      case 'start':
        start();
        break;
      case 'pause':
        pause();
        break;
      case 'resume':
        resume();
        break;
      case 'reset':
        reset();
        break;
      case 'skip':
        skip();
        break;
      case 'finish-early':
        finishEarly();
        break;
      case 'set-mode':
        if (msg.mode) setMode(msg.mode);
        break;
      case 'open-settings':
        desktopService.showMainWindow();
        router.push('/settings');
        break;
      case 'open-main':
        desktopService.showMainWindow();
        desktopService.hideMiniTimer();
        router.push('/');
        break;
    }
  };

  // Initialize listeners and lifecycle
  const initTimer = () => {
    // Initial duration
    remainingSeconds.value = targetDurationSeconds.value;

    // Listen to IPC actions from mini timer
    desktopService.onTimerAction((msg) => {
      handleAction(msg);
    });

    // Window visibility wake-up listener to immediately eliminate sleep drift
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && status.value === 'running') {
          syncTimeFromTimestamp();
        }
      });
    }

    broadcastState();
  };

  return {
    mode,
    status,
    startedAt,
    endsAt,
    remainingSeconds,
    completedPomodoros,
    currentTreeSpecies,
    currentTreeStage,
    targetDurationSeconds,
    state,
    progress,
    formattedTime,
    initTimer,
    setMode,
    start,
    pause,
    resume,
    reset,
    skip,
    finishEarly,
    syncTimeFromTimestamp,
    broadcastState,
  };
});
