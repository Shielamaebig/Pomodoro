<template>
  <div
    class="circular-tree-progress"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      class="progress-ring-svg"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
    >
      <!-- Background subtle track -->
      <circle
        class="progress-track"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
      />

      <!-- Animated Progress Fill -->
      <circle
        class="progress-indicator"
        :class="mode"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
      />
    </svg>

    <!-- Center Slot for Tree or Icon -->
    <div class="progress-center-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimerMode } from '../../types/timer';

const props = withDefaults(
  defineProps<{
    progress: number; // 0.0 to 1.0
    size?: number;
    strokeWidth?: number;
    mode?: TimerMode;
  }>(),
  {
    progress: 0,
    size: 96,
    strokeWidth: 3.5,
    mode: 'focus',
  }
);

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth * 2) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

const strokeDashoffset = computed(() => {
  const p = Math.min(1, Math.max(0, props.progress));
  return circumference.value * (1 - p);
});
</script>

<style scoped>
.circular-tree-progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring-svg {
  transform: rotate(-90deg);
  overflow: visible;
}

.progress-track {
  fill: none;
  stroke: var(--border-subtle);
  opacity: 0.55;
}

.progress-indicator {
  fill: none;
  transition: stroke-dashoffset 0.4s ease-out;
}

.progress-indicator.focus {
  stroke: var(--accent-focus, #10B981);
}

.progress-indicator.shortBreak {
  stroke: var(--accent-short-break, #3B82F6);
}

.progress-indicator.longBreak {
  stroke: var(--accent-long-break, #8B5CF6);
}

.progress-center-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>
