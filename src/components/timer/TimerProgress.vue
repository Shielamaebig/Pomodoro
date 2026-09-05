<template>
  <div class="timer-progress-container">
    <svg class="progress-ring" :width="size" :height="size">
      <!-- Background Track -->
      <circle
        class="progress-track"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        fill="transparent"
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
      />
      <!-- Active Progress Circle -->
      <circle
        class="progress-circle"
        :stroke="accentColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
        fill="transparent"
        :r="radius"
        :cx="size / 2"
        :cy="size / 2"
        :style="{ filter: `drop-shadow(0 0 6px ${glowColor})` }"
      />
    </svg>
    <div class="content-overlay">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    progress: number; // 0 to 1
    mode: 'focus' | 'shortBreak' | 'longBreak';
    size?: number;
    strokeWidth?: number;
  }>(),
  {
    size: 280,
    strokeWidth: 8,
  }
);

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

// Invert offset so progress fills up clockwise smoothly
const strokeDashoffset = computed(() => {
  return circumference.value * (1 - props.progress);
});

const accentColor = computed(() => {
  if (props.mode === 'focus') return 'var(--accent-focus)';
  if (props.mode === 'shortBreak') return 'var(--accent-short-break)';
  return 'var(--accent-long-break)';
});

const glowColor = computed(() => {
  if (props.mode === 'focus') return 'var(--accent-focus-glow)';
  if (props.mode === 'shortBreak') return 'var(--accent-short-break-glow)';
  return 'var(--accent-long-break-glow)';
});

const trackColor = computed(() => 'var(--border-subtle)');
</script>

<style scoped>
.timer-progress-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto;
}

.progress-ring {
  transform: rotate(-90deg);
  overflow: visible;
}

.progress-track {
  transition: stroke var(--transition-normal);
}

.progress-circle {
  transition: stroke-dashoffset 0.3s ease, stroke var(--transition-normal);
}

.content-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>
