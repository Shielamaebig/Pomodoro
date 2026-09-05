<template>
  <div class="mini-window-root" :class="[themeClass]">
    <MiniFocusWidget
      :mode="timerState.mode"
      :status="timerState.status"
      :formatted-time="formattedTime"
      :progress="progress"
      :completed-pomodoros="timerState.completedPomodoros"
      :tree-species="timerState.treeSpecies || 'oak'"
      :tree-stage="timerState.treeStage ?? 0"
      :task-title="currentTaskTitle"
      :show-task="settingsStore.settings.showTaskInMiniTimer"
      :initial-style="settingsStore.settings.miniWidgetStyle || 'focus'"
      @toggle-run="handleToggleRun"
      @reset="handleReset"
      @skip="handleSkip"
      @open-settings="handleOpenSettings"
      @open-main="handleOpenMain"
      @style-change="handleStyleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { TimerState } from '../types/timer';
import { useSettingsStore } from '../stores/settingsStore';
import { useTaskStore } from '../stores/taskStore';
import { desktopService } from '../services/desktopService';
import MiniFocusWidget from '../components/miniTimer/MiniFocusWidget.vue';

const settingsStore = useSettingsStore();
const taskStore = useTaskStore();

// Local shadow of authoritative timer state
const timerState = ref<TimerState>({
  mode: 'focus',
  status: 'idle',
  startedAt: null,
  endsAt: null,
  remainingSeconds: 25 * 60,
  totalDurationSeconds: 25 * 60,
  completedPomodoros: 0,
  currentTaskId: null,
  treeSpecies: 'oak',
  treeStage: 0,
});

let unlistenTimer: (() => void) | null = null;

const themeClass = computed(() => {
  const theme = settingsStore.settings.theme;
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
});

const formattedTime = computed(() => {
  const mins = Math.floor(timerState.value.remainingSeconds / 60);
  const secs = timerState.value.remainingSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

const progress = computed(() => {
  const total = timerState.value.totalDurationSeconds;
  if (total <= 0) return 0;
  const elapsed = total - timerState.value.remainingSeconds;
  return Math.min(1, Math.max(0, elapsed / total));
});

const currentTaskTitle = computed(() => {
  if (!timerState.value.currentTaskId) return undefined;
  const task = taskStore.tasks.find((t) => t.id === timerState.value.currentTaskId);
  return task ? task.title : undefined;
});

const handleToggleRun = () => {
  if (timerState.value.status === 'running') {
    desktopService.emitTimerAction({ action: 'pause' });
  } else if (timerState.value.status === 'paused') {
    desktopService.emitTimerAction({ action: 'resume' });
  } else {
    desktopService.emitTimerAction({ action: 'start' });
  }
};

const handleReset = () => {
  desktopService.emitTimerAction({ action: 'reset' });
};

const handleSkip = () => {
  desktopService.emitTimerAction({ action: 'skip' });
};

const handleOpenSettings = () => {
  desktopService.emitTimerAction({ action: 'open-settings' });
};

const handleOpenMain = async () => {
  desktopService.emitTimerAction({ action: 'open-main' });
  await desktopService.showMainWindow();
  await desktopService.hideMiniTimer();
};

const handleStyleChange = (style: 'focus' | 'compact') => {
  settingsStore.updateSettings({ miniWidgetStyle: style });
};

onMounted(async () => {
  await settingsStore.loadSettings();
  await taskStore.loadTasks();

  unlistenTimer = await desktopService.onTimerState((newState) => {
    timerState.value = newState;
  });

  // Restore remembered position
  await desktopService.restoreMiniPosition();

  // Ensure the window has adequate dimensions for rounded shadow rendering
  await desktopService.setMiniWindowSize(settingsStore.settings.miniWidgetStyle || 'focus');

  // Disable OS window shadow rectangle
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().setShadow(false);
  } catch {
    // Web mode fallback
  }
});

onUnmounted(() => {
  if (unlistenTimer) {
    unlistenTimer();
  }
  desktopService.saveMiniPosition();
});
</script>

<style scoped>
.mini-window-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  padding: 16px;
  margin: 0;
  overflow: visible;
  box-sizing: border-box;
}
</style>
