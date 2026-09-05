<template>
  <div class="timer-controls">
    <!-- Secondary action: Reset -->
    <button
      class="control-btn secondary-btn"
      :disabled="status === 'idle'"
      title="Reset current timer"
      @click="$emit('reset')"
    >
      <RotateCcw :size="18" />
    </button>

    <!-- Primary Action: Start / Pause / Resume -->
    <button
      v-if="status === 'idle'"
      class="control-btn primary-btn"
      :class="mode"
      title="Start Timer (Space)"
      @click="$emit('start')"
    >
      <Play :size="22" class="play-icon" />
      <span class="btn-text">Start</span>
    </button>

    <button
      v-else-if="status === 'running'"
      class="control-btn primary-btn"
      :class="mode"
      title="Pause Timer (Space)"
      @click="$emit('pause')"
    >
      <Pause :size="22" />
      <span class="btn-text">Pause</span>
    </button>

    <button
      v-else
      class="control-btn primary-btn"
      :class="mode"
      title="Resume Timer (Space)"
      @click="$emit('resume')"
    >
      <Play :size="22" class="play-icon" />
      <span class="btn-text">Resume</span>
    </button>

    <!-- Secondary action: Skip -->
    <button
      class="control-btn secondary-btn"
      title="Skip to next session"
      @click="$emit('skip')"
    >
      <SkipForward :size="18" />
    </button>

    <!-- Quick Early Finish Button (for Focus sessions) -->
    <button
      v-if="mode === 'focus' && status !== 'idle'"
      class="finish-early-btn"
      title="Finish session early and mark complete"
      @click="$emit('finish-early')"
    >
      <CheckCircle :size="14" />
      <span>Done Early</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle } from 'lucide-vue-next';
import type { TimerMode, TimerStatus } from '../../types/timer';

const props = defineProps<{
  mode: TimerMode;
  status: TimerStatus;
}>();

const emit = defineEmits<{
  (e: 'start'): void;
  (e: 'pause'): void;
  (e: 'resume'): void;
  (e: 'reset'): void;
  (e: 'skip'): void;
  (e: 'finish-early'): void;
}>();

// Keyboard shortcut: Spacebar to toggle start/pause/resume
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
    e.preventDefault();
    if (props.status === 'idle') emit('start');
    else if (props.status === 'running') emit('pause');
    else emit('resume');
  }
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>

<style scoped>
.timer-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  margin-top: 0.5rem;
  position: relative;
}

.control-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.primary-btn {
  padding: 0.75rem 2.2rem;
  font-size: 1.05rem;
  font-weight: 600;
  gap: 0.5rem;
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.primary-btn.focus {
  background: var(--accent-focus);
}
.primary-btn.focus:hover {
  background: #cf381f;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--accent-focus-glow);
}

.primary-btn.shortBreak {
  background: var(--accent-short-break);
}
.primary-btn.shortBreak:hover {
  background: #0ea372;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--accent-short-break-glow);
}

.primary-btn.longBreak {
  background: var(--accent-long-break);
}
.primary-btn.longBreak:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px var(--accent-long-break-glow);
}

.primary-btn:active {
  transform: translateY(1px);
}

.play-icon {
  margin-left: 2px;
}

.secondary-btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
}

.secondary-btn:hover:not(:disabled) {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
  border-color: var(--border-strong);
  transform: translateY(-1px);
}

.secondary-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.finish-early-btn {
  position: absolute;
  right: -95px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  padding: 5px 9px;
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.finish-early-btn:hover {
  color: var(--accent-focus);
  border-color: var(--accent-focus);
  background: var(--bg-surface-hover);
}
</style>
