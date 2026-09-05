<template>
  <div
    class="mini-timer-wrapper titlebar-drag-region"
    :class="[size, mode]"
    @mousedown="handleDragStart"
  >
    <!-- Compact Size -->
    <div v-if="size === 'compact'" class="layout-compact">
      <div class="time-group">
        <span class="mode-icon">{{ modeEmoji }}</span>
        <span class="time tabular-nums">{{ formattedTime }}</span>
      </div>
      <MiniTimerControls
        :status="status"
        :size="size"
        @toggle-run="$emit('toggle-run')"
        @open-main="$emit('open-main')"
        @hide="$emit('hide')"
      />
    </div>

    <!-- Normal Size -->
    <div v-else-if="size === 'normal'" class="layout-normal">
      <div class="left-col">
        <div class="mode-row">
          <span class="mode-icon">{{ modeEmoji }}</span>
          <span class="mode-tag">{{ modeLabel }}</span>
        </div>
        <span class="time tabular-nums">{{ formattedTime }}</span>
      </div>

      <MiniTimerControls
        :status="status"
        :size="size"
        @toggle-run="$emit('toggle-run')"
        @open-main="$emit('open-main')"
        @hide="$emit('hide')"
      />
    </div>

    <!-- Expanded Size -->
    <div v-else class="layout-expanded">
      <div class="expanded-header">
        <div class="header-left">
          <span class="mode-icon">{{ modeEmoji }}</span>
          <span class="time tabular-nums">{{ formattedTime }}</span>
          <span class="session-badge">🌳 {{ completedPomodoros }}</span>
        </div>
        <MiniTimerControls
          :status="status"
          :size="size"
          @toggle-run="$emit('toggle-run')"
          @open-main="$emit('open-main')"
          @hide="$emit('hide')"
        />
      </div>

      <!-- Optional Task Title -->
      <div v-if="showTask && taskTitle" class="expanded-task">
        <span class="task-title-text">{{ taskTitle }}</span>
      </div>

      <!-- Linear Progress Bar -->
      <div class="progress-bar-track">
        <div
          class="progress-bar-fill"
          :class="mode"
          :style="{ width: `${progress * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerMode, TimerStatus, MiniTimerSize } from '../../types/timer';
import MiniTimerControls from './MiniTimerControls.vue';
import { desktopService } from '../../services/desktopService';

const props = defineProps<{
  mode: TimerMode;
  status: TimerStatus;
  formattedTime: string;
  progress: number;
  size: MiniTimerSize;
  completedPomodoros: number;
  taskTitle?: string;
  showTask?: boolean;
}>();

defineEmits<{
  (e: 'toggle-run'): void;
  (e: 'open-main'): void;
  (e: 'hide'): void;
}>();

const modeEmoji = computed(() => (props.mode === 'focus' ? '🌳' : '☕'));

const modeLabel = computed(() => {
  if (props.mode === 'focus') return 'Focus';
  if (props.mode === 'shortBreak') return 'Short Break';
  return 'Long Break';
});

const handleDragStart = (e: MouseEvent) => {
  // Only drag if left clicked and not on a button or interactive element
  if (e.button === 0 && !(e.target as HTMLElement).closest('.no-drag')) {
    desktopService.startDragging();
  }
};
</script>

<style scoped>
.mini-timer-wrapper {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  user-select: none;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.mini-timer-wrapper:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-lg);
}

/* Compact Layout */
.layout-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  gap: 10px;
}

.time-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.layout-compact .time {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Normal Layout */
.layout-normal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
}

.left-col {
  display: flex;
  flex-direction: column;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 1px;
}

.mode-tag {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.layout-normal .time {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

/* Expanded Layout */
.layout-expanded {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  gap: 6px;
}

.expanded-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.layout-expanded .time {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.session-badge {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--bg-surface-hover);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.expanded-task {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar-track {
  width: 100%;
  height: 4px;
  background: var(--bg-surface-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 2px;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-bar-fill.focus {
  background: var(--accent-focus);
}

.progress-bar-fill.shortBreak {
  background: var(--accent-short-break);
}

.progress-bar-fill.longBreak {
  background: var(--accent-long-break);
}

.mode-icon {
  font-size: 1rem;
}
</style>
