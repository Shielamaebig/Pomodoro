<template>
  <div class="weekly-chart-card">
    <div class="chart-header">
      <h3>Weekly Focus Activity</h3>
      <span class="total-week tabular-nums">{{ formattedWeekTime }} focused</span>
    </div>

    <div class="bars-container">
      <div
        v-for="day in data"
        :key="day.dateStr"
        class="bar-column"
        :class="{ 'is-today': isToday(day.dateStr) }"
      >
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ height: getBarHeight(day.focusMinutes) }"
            :title="`${day.dayName}: ${day.focusMinutes} mins (${day.pomodoroCount} pomodoros)`"
          >
            <span v-if="day.focusMinutes > 0" class="bar-value tabular-nums">
              {{ day.focusMinutes }}m
            </span>
          </div>
        </div>
        <span class="day-label">{{ day.dayName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DailyChartData } from '../../stores/statsStore';

const props = defineProps<{
  data: DailyChartData[];
  totalWeekMinutes: number;
}>();

const maxMinutes = computed(() => {
  const max = Math.max(...props.data.map((d) => d.focusMinutes), 60);
  return max;
});

const getBarHeight = (minutes: number) => {
  if (minutes <= 0) return '3px';
  const pct = Math.min(100, Math.max(8, (minutes / maxMinutes.value) * 100));
  return `${pct}%`;
};

const isToday = (dateStr: string) => {
  return new Date().toISOString().slice(0, 10) === dateStr;
};

const formattedWeekTime = computed(() => {
  const hours = Math.floor(props.totalWeekMinutes / 60);
  const mins = props.totalWeekMinutes % 60;
  return `${hours}h ${mins}m`;
});
</script>

<style scoped>
.weekly-chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.total-week {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--accent-focus);
}

.bars-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-track {
  flex: 1;
  width: 100%;
  max-width: 38px;
  background: var(--bg-surface-hover);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  width: 100%;
  background: var(--accent-focus);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
}

.bar-column.is-today .bar-fill {
  background: #E24429;
  box-shadow: 0 0 10px var(--accent-focus-glow);
}

.bar-value {
  font-size: 0.65rem;
  font-weight: 600;
  color: #FFFFFF;
}

.day-label {
  margin-top: 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}

.bar-column.is-today .day-label {
  color: var(--text-primary);
  font-weight: 700;
}
</style>
