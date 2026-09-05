<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from './stores/settingsStore';
import { useTaskStore } from './stores/taskStore';
import { useStatsStore } from './stores/statsStore';
import { useTimerStore } from './stores/timerStore';
import { isTauri, desktopService } from './services/desktopService';

const settingsStore = useSettingsStore();
const taskStore = useTaskStore();
const statsStore = useStatsStore();
const timerStore = useTimerStore();

onMounted(async () => {
  // Load local persistent state
  await settingsStore.loadSettings();
  await taskStore.loadTasks();
  await statsStore.loadSessions();

  // Initialize authoritative timer engine
  timerStore.initTimer();

  // Restore floating mini widget if user enabled it
  if (settingsStore.settings.showFloatingMiniTimer) {
    desktopService.showMiniTimer();
  }

  // Intercept window close on main desktop window for minimize-to-tray
  if (isTauri()) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();
      if (appWindow.label === 'main') {
        await appWindow.onCloseRequested(async (event) => {
          if (settingsStore.settings.minimizeToTray) {
            // Prevent close, hide window instead
            event.preventDefault();
            await appWindow.hide();
          }
        });
      }
    } catch (e) {
      console.warn('Failed to register window close listener:', e);
    }
  }
});
</script>

<style>
/* App Root */
</style>
