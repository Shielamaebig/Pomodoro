<template>
  <div
    class="floating-widget-wrapper"
    :class="[
      mode,
      status,
      displayStyle,
      { 'is-hovered': isHovered, 'is-celebrating': isCelebrating }
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown="handleDragStart"
  >
    <!-- ============================================== -->
    <!-- COMPACT MODE PILL (190px x 58px)               -->
    <!-- ============================================== -->
    <div v-if="displayStyle === 'compact'" class="compact-layout">
      <button
        class="compact-tree-btn no-drag"
        title="Expand focus widget"
        @click="toggleStyle('focus')"
      >
        <TreeIllustration
          v-if="mode === 'focus'"
          :species="treeSpecies"
          :stage="treeStage"
          :size="28"
        />
        <Coffee v-else :size="18" class="break-icon" />
      </button>

      <span class="compact-time tabular-nums">{{ formattedTime }}</span>

      <div class="compact-actions no-drag">
        <button
          class="icon-action-btn"
          :title="status === 'running' ? 'Pause' : 'Resume'"
          @click.stop="$emit('toggle-run')"
        >
          <Pause v-if="status === 'running'" :size="14" />
          <Play v-else :size="14" />
        </button>

        <button
          class="icon-action-btn"
          title="Open Settings"
          @click.stop="$emit('open-settings')"
        >
          <Settings :size="14" />
        </button>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- EXPANDED FOCUS WIDGET (240px x 210px)          -->
    <!-- ============================================== -->
    <div v-else class="focus-layout">
      <!-- Top Navigation & Settings Bar -->
      <div class="widget-header">
        <span class="mode-tag" :class="mode">
          {{ modeLabel }}
        </span>

        <div class="header-tools no-drag">
          <!-- Switch to compact -->
          <button
            class="header-tool-btn"
            title="Compact mode"
            @click.stop="toggleStyle('compact')"
          >
            <Minimize2 :size="12" />
          </button>

          <!-- Open Settings in Main App -->
          <button
            class="header-tool-btn"
            title="Open Settings in desktop app"
            @click.stop="$emit('open-settings')"
          >
            <Settings :size="13" />
          </button>
        </div>
      </div>

      <!-- Center Tree / Break Graphic with Circular Progress -->
      <div class="visual-center">
        <!-- Celebration Banner if session just finished -->
        <div v-if="isCelebrating" class="celebration-banner">
          <Sparkles :size="15" class="sparkle-icon" />
          <span class="celebration-text">Focus Done!</span>
        </div>

        <CircularTreeProgress
          v-else
          :progress="progress"
          :size="68"
          :stroke-width="2.8"
          :mode="mode"
        >
          <!-- Growing Tree for Focus -->
          <TreeIllustration
            v-if="mode === 'focus'"
            :species="treeSpecies"
            :stage="treeStage"
            :size="48"
            :is-celebration="isCelebrating"
          />

          <!-- Calm Zen Coffee/Tea for Breaks -->
          <div v-else class="break-graphic">
            <Coffee :size="26" class="break-zen-icon" />
          </div>
        </CircularTreeProgress>
      </div>

      <!-- Prominent Timer Display -->
      <div class="timer-area">
        <span class="timer-digits tabular-nums">{{ formattedTime }}</span>
      </div>

      <!-- Current Task Label (Truncated) -->
      <div class="task-area">
        <span
          v-if="showTask && taskTitle"
          class="task-title-text"
          :title="taskTitle"
        >
          {{ taskTitle }}
        </span>
        <span v-else-if="mode === 'focus'" class="task-placeholder-text">
          Deep Focus
        </span>
        <span v-else class="task-placeholder-text">
          Rest your eyes & stretch
        </span>
      </div>

      <!-- Interactive Controls (Always shows pause/resume; hover reveals reset & skip) -->
      <div class="controls-bar no-drag">
        <!-- Hover Reset -->
        <Transition name="fade-scale">
          <button
            v-if="isHovered"
            class="action-btn secondary"
            title="Reset timer"
            @click.stop="$emit('reset')"
          >
            <RotateCcw :size="13" />
          </button>
        </Transition>

        <!-- Primary Play / Pause -->
        <button
          class="action-btn primary"
          :class="{ running: status === 'running' }"
          :title="status === 'running' ? 'Pause' : 'Resume'"
          @click.stop="$emit('toggle-run')"
        >
          <Pause v-if="status === 'running'" :size="15" />
          <Play v-else :size="15" />
        </button>

        <!-- Hover Skip -->
        <Transition name="fade-scale">
          <button
            v-if="isHovered"
            class="action-btn secondary"
            title="Skip session"
            @click.stop="$emit('skip')"
          >
            <SkipForward :size="13" />
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Minimize2,
  Coffee,
  Sparkles,
} from 'lucide-vue-next';
import type { TimerMode, TimerStatus } from '../../types/timer';
import type { TreeSpecies, TreeStage } from '../../types/tree';
import TreeIllustration from '../tree/TreeIllustration.vue';
import CircularTreeProgress from '../tree/CircularTreeProgress.vue';
import { desktopService } from '../../services/desktopService';

const props = withDefaults(
  defineProps<{
    mode: TimerMode;
    status: TimerStatus;
    formattedTime: string;
    progress: number;
    completedPomodoros: number;
    treeSpecies?: TreeSpecies;
    treeStage?: TreeStage;
    taskTitle?: string;
    showTask?: boolean;
    initialStyle?: 'focus' | 'compact';
  }>(),
  {
    treeSpecies: 'oak',
    treeStage: 0,
    showTask: true,
    initialStyle: 'focus',
  }
);

const emit = defineEmits<{
  (e: 'toggle-run'): void;
  (e: 'reset'): void;
  (e: 'skip'): void;
  (e: 'open-settings'): void;
  (e: 'open-main'): void;
  (e: 'style-change', style: 'focus' | 'compact'): void;
}>();

const isHovered = ref(false);
const isCelebrating = ref(false);
const displayStyle = ref<'focus' | 'compact'>(props.initialStyle);

const modeLabel = computed(() => {
  if (props.mode === 'focus') return 'Focus';
  if (props.mode === 'shortBreak') return 'Short Break';
  return 'Long Break';
});

const toggleStyle = (newStyle: 'focus' | 'compact') => {
  displayStyle.value = newStyle;
  emit('style-change', newStyle);
  desktopService.setMiniWindowSize(newStyle);
};

const handleDragStart = (e: MouseEvent) => {
  // Allow dragging only with left button and not on buttons
  if (e.button === 0 && !(e.target as HTMLElement).closest('.no-drag')) {
    desktopService.startDragging();
  }
};
</script>

<style scoped>
/* Main Floating Widget Shell */
.floating-widget-wrapper {
  background: var(--bg-surface, rgba(255, 255, 255, 0.94));
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 28px;
  box-shadow:
    0 4px 16px -2px rgba(0, 0, 0, 0.16),
    0 2px 6px -1px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  user-select: none;
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

:global(.dark) .floating-widget-wrapper {
  background: rgba(22, 27, 34, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow:
    0 4px 20px -2px rgba(0, 0, 0, 0.5),
    0 2px 6px -1px rgba(0, 0, 0, 0.3);
}

.floating-widget-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 6px 24px -2px rgba(0, 0, 0, 0.55),
    0 2px 8px -1px rgba(0, 0, 0, 0.35);
}

/* ============================================== */
/* FOCUS LAYOUT                                   */
/* ============================================== */
.focus-layout {
  width: 194px;
  height: 168px;
  padding: 8px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

/* Top Header */
.widget-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted, #6B7280);
}

.mode-tag.focus {
  color: var(--accent-focus, #10B981);
}

.mode-tag.shortBreak,
.mode-tag.longBreak {
  color: var(--accent-short-break, #3B82F6);
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-tool-btn {
  background: transparent;
  border: none;
  color: var(--text-muted, #9CA3AF);
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.header-tool-btn:hover {
  color: var(--text-primary, #111827);
  background: var(--bg-surface-hover, rgba(0, 0, 0, 0.05));
}

/* Center Visual Tree */
.visual-center {
  margin-top: 1px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.break-zen-icon {
  color: var(--accent-short-break, #3B82F6);
  opacity: 0.9;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.25));
}

/* Celebration Banner */
.celebration-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.3));
  border: 1px solid rgba(245, 158, 11, 0.4);
  padding: 6px 12px;
  border-radius: 20px;
  color: #D97706;
}

.celebration-text {
  font-size: 0.85rem;
  font-weight: 700;
}

.sparkle-icon {
  animation: spinSlow 3s linear infinite;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Timer Digits */
.timer-area {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.timer-digits {
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary, #111827);
}

:global(.dark) .timer-digits {
  color: #F3F4F6;
}

/* Task Title Area */
.task-area {
  width: 100%;
  text-align: center;
  padding: 0 4px;
}

.task-title-text {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary, #4B5563);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

:global(.dark) .task-title-text {
  color: #9CA3AF;
}

.task-placeholder-text {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--text-muted, #9CA3AF);
}

/* Controls Bar */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 26px;
}

.action-btn {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.action-btn.primary {
  width: 26px;
  height: 26px;
  background: var(--bg-surface-hover, rgba(0, 0, 0, 0.07));
  color: var(--text-primary, #111827);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

:global(.dark) .action-btn.primary {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

.action-btn.primary:hover {
  transform: scale(1.08);
  background: var(--accent-focus, #10B981);
  color: #FFFFFF;
}

.action-btn.secondary {
  width: 22px;
  height: 22px;
  background: transparent;
  color: var(--text-muted, #9CA3AF);
}

.action-btn.secondary:hover {
  color: var(--text-primary, #111827);
  background: var(--bg-surface-hover, rgba(0, 0, 0, 0.05));
  transform: scale(1.05);
}

/* ============================================== */
/* COMPACT LAYOUT (190px x 58px)                  */
/* ============================================== */
.compact-layout {
  width: 190px;
  height: 54px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.compact-tree-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.15s ease;
}

.compact-tree-btn:hover {
  transform: scale(1.1);
}

.compact-time {
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary, #111827);
}

:global(.dark) .compact-time {
  color: #F3F4F6;
}

.compact-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-action-btn {
  background: transparent;
  border: none;
  color: var(--text-muted, #6B7280);
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.icon-action-btn:hover {
  color: var(--text-primary, #111827);
  background: var(--bg-surface-hover, rgba(0, 0, 0, 0.06));
}

/* Fade Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
