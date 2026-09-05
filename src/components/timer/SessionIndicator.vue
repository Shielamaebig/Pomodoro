<template>
  <div class="session-indicator" :title="`${completedInCycle} of ${totalCycle} sessions completed before long break`">
    <div
      v-for="index in totalCycle"
      :key="index"
      class="indicator-dot"
      :class="{
        active: index <= completedInCycle,
        current: index === completedInCycle + 1 && isFocusRunning,
      }"
    >
      <span v-if="index <= completedInCycle" class="tomato-icon">🍅</span>
      <span v-else class="empty-dot"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    completedPomodoros: number;
    totalCycle?: number;
    isFocusRunning?: boolean;
  }>(),
  {
    totalCycle: 4,
    isFocusRunning: false,
  }
);

const completedInCycle = computed(() => {
  return props.completedPomodoros % props.totalCycle;
});
</script>

<style scoped>
.session-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  margin: 0.75rem 0;
}

.indicator-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all var(--transition-normal);
}

.tomato-icon {
  font-size: 1.15rem;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.empty-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-subtle);
  border: 1.5px solid var(--border-strong);
  transition: all var(--transition-fast);
}

.indicator-dot.current .empty-dot {
  border-color: var(--accent-focus);
  animation: pulseDot 1.6s infinite ease-in-out;
}

@keyframes popIn {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulseDot {
  0%, 100% {
    transform: scale(1);
    background-color: transparent;
  }
  50% {
    transform: scale(1.3);
    background-color: var(--accent-focus-light);
  }
}
</style>
