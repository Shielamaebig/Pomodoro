<template>
  <div class="timer-display">
    <!-- Mode Switcher Tabs -->
    <div class="mode-tabs">
      <button
        class="mode-btn"
        :class="{ active: mode === 'focus' }"
        @click="selectMode('focus')"
      >
        Focus
      </button>
      <button
        class="mode-btn"
        :class="{ active: mode === 'shortBreak' }"
        @click="selectMode('shortBreak')"
      >
        Short Break
      </button>
      <button
        class="mode-btn"
        :class="{ active: mode === 'longBreak' }"
        @click="selectMode('longBreak')"
      >
        Long Break
      </button>
    </div>

    <!-- Central Time Display with Progress Ring -->
    <TimerProgress :progress="progress" :mode="mode" :size="300" :stroke-width="7">
      <div class="time-readout">
        <div v-if="mode === 'focus'" class="main-tree-preview">
          <TreeIllustration :species="treeSpecies || 'oak'" :stage="treeStage ?? 0" :size="48" />
        </div>
        <span v-else class="status-badge" :class="mode">
          {{ modeLabel }}
        </span>
        <h1 class="time-numbers tabular-nums">{{ formattedTime }}</h1>
        <p class="status-subtext">{{ statusMessage }}</p>
      </div>
    </TimerProgress>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerMode, TimerStatus } from '../../types/timer';
import type { TreeSpecies, TreeStage } from '../../types/tree';
import TimerProgress from './TimerProgress.vue';
import TreeIllustration from '../tree/TreeIllustration.vue';

const props = defineProps<{
  mode: TimerMode;
  status: TimerStatus;
  formattedTime: string;
  progress: number;
  treeSpecies?: TreeSpecies;
  treeStage?: TreeStage;
}>();

const emit = defineEmits<{
  (e: 'change-mode', mode: TimerMode): void;
}>();

const selectMode = (newMode: TimerMode) => {
  if (props.mode !== newMode) {
    emit('change-mode', newMode);
  }
};

const modeLabel = computed(() => {
  if (props.mode === 'focus') return 'FOCUS';
  if (props.mode === 'shortBreak') return 'SHORT BREAK';
  return 'LONG BREAK';
});

const statusMessage = computed(() => {
  if (props.status === 'paused') return 'Paused';
  if (props.status === 'running') {
    return props.mode === 'focus' ? 'Stay focused' : 'Relax & recharge';
  }
  return 'Ready to start';
});
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
}

.mode-tabs {
  display: flex;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 4px;
  border-radius: var(--radius-full);
  gap: 4px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 0.5rem;
}

.mode-btn {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.mode-btn:hover {
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.time-readout {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  user-select: none;
}

.status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  margin-bottom: 0.25rem;
}

.status-badge.focus {
  background: var(--accent-focus-light);
  color: var(--accent-focus);
}

.status-badge.shortBreak {
  background: var(--accent-short-break-light);
  color: var(--accent-short-break);
}

.status-badge.longBreak {
  background: var(--accent-long-break-light);
  color: var(--accent-long-break);
}

.time-numbers {
  font-size: 4.5rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--text-primary);
}

.status-subtext {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
}
</style>
