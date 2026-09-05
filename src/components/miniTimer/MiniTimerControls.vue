<template>
  <div class="mini-controls no-drag">
    <!-- Play / Pause -->
    <button
      class="mini-btn"
      :class="{ running: status === 'running' }"
      :title="status === 'running' ? 'Pause' : 'Start/Resume'"
      @click.stop="$emit('toggle-run')"
    >
      <Pause v-if="status === 'running'" :size="14" />
      <Play v-else :size="14" class="play-icon" />
    </button>

    <!-- Open Main Window -->
    <button
      v-if="size !== 'compact'"
      class="mini-btn icon-btn"
      title="Open Main Window"
      @click.stop="$emit('open-main')"
    >
      <Maximize2 :size="13" />
    </button>

    <!-- Close / Hide Mini Timer -->
    <button
      v-if="size !== 'compact'"
      class="mini-btn icon-btn close-btn"
      title="Hide Mini Timer"
      @click.stop="$emit('hide')"
    >
      <X :size="13" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause, Maximize2, X } from 'lucide-vue-next';
import type { TimerStatus, MiniTimerSize } from '../../types/timer';

defineProps<{
  status: TimerStatus;
  size: MiniTimerSize;
}>();

defineEmits<{
  (e: 'toggle-run'): void;
  (e: 'open-main'): void;
  (e: 'hide'): void;
}>();
</script>

<style scoped>
.mini-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mini-btn {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface-hover);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.mini-btn:hover {
  background: var(--bg-surface-active);
  transform: scale(1.05);
}

.mini-btn.running {
  background: var(--active-accent-light);
  color: var(--active-accent);
}

.icon-btn {
  color: var(--text-muted);
}

.icon-btn:hover {
  color: var(--text-primary);
}

.close-btn:hover {
  color: #EF4444;
}

.play-icon {
  margin-left: 1px;
}
</style>
