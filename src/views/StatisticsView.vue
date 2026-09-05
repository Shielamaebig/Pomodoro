<template>
  <div class="statistics-view">
    <div class="view-header">
      <h2>Productivity Statistics</h2>
      <p class="subtitle">Overview of your work velocity and consistency</p>
    </div>

    <!-- Summary Cards -->
    <FocusSummary
      :today-minutes="statsStore.todayFocusMinutes"
      :today-pomodoros="statsStore.todayPomodoros"
      :week-minutes="statsStore.weekFocusMinutes"
      :week-pomodoros="statsStore.weekPomodoros"
      :completed-tasks-count="completedTasksCount"
      :active-tasks-count="activeTasksCount"
      :streak-current="statsStore.streaks.current"
      :streak-longest="statsStore.streaks.longest"
    />

    <!-- Weekly Chart -->
    <WeeklyChart
      :data="statsStore.weeklyChartData"
      :total-week-minutes="statsStore.weekFocusMinutes"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatsStore } from '../stores/statsStore';
import { useTaskStore } from '../stores/taskStore';
import FocusSummary from '../components/statistics/FocusSummary.vue';
import WeeklyChart from '../components/statistics/WeeklyChart.vue';

const statsStore = useStatsStore();
const taskStore = useTaskStore();

const completedTasksCount = computed(() => taskStore.tasks.filter((t) => t.completed).length);
const activeTasksCount = computed(() => taskStore.tasks.filter((t) => !t.completed).length);
</script>

<style scoped>
.statistics-view {
  padding: 1.5rem 2rem;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.view-header {
  margin-bottom: 1.25rem;
}

.view-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 2px;
}
</style>
