<template>
  <div class="summary-grid">
    <!-- Today Focus Time Card -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Today's Focus</span>
        <Clock :size="16" class="stat-icon" />
      </div>
      <div class="stat-value tabular-nums">
        {{ formattedTodayTime }}
      </div>
      <div class="stat-footer">
        {{ todayPomodoros }} completed {{ todayPomodoros === 1 ? 'session' : 'sessions' }}
      </div>
    </div>

    <!-- Pomodoros Today Card -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Total Pomodoros</span>
        <span class="stat-icon">🌳</span>
      </div>
      <div class="stat-value tabular-nums">
        {{ todayPomodoros }}
      </div>
      <div class="stat-footer">
        {{ weekPomodoros }} this week
      </div>
    </div>

    <!-- Completed Tasks Card -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Tasks Completed</span>
        <CheckCircle2 :size="16" class="stat-icon" />
      </div>
      <div class="stat-value tabular-nums">
        {{ completedTasksCount }}
      </div>
      <div class="stat-footer">
        {{ activeTasksCount }} remaining
      </div>
    </div>

    <!-- Streak Card -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Current Streak</span>
        <Flame :size="16" class="stat-icon streak" />
      </div>
      <div class="stat-value tabular-nums">
        {{ streakCurrent }} <span class="stat-unit">days</span>
      </div>
      <div class="stat-footer">
        Best streak: {{ streakLongest }} days
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Clock, CheckCircle2, Flame } from 'lucide-vue-next';

const props = defineProps<{
  todayMinutes: number;
  todayPomodoros: number;
  weekMinutes: number;
  weekPomodoros: number;
  completedTasksCount: number;
  activeTasksCount: number;
  streakCurrent: number;
  streakLongest: number;
}>();

const formattedTodayTime = computed(() => {
  const hours = Math.floor(props.todayMinutes / 60);
  const mins = props.todayMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
});
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-muted);
}

.stat-icon {
  color: var(--text-secondary);
}

.stat-icon.streak {
  color: #F59E0B;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-unit {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-muted);
}

.stat-footer {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
