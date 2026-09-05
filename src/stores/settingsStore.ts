import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AppSettings, MiniTimerSize } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';
import { databaseService } from '../services/databaseService';
import { desktopService } from '../services/desktopService';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS });
  const isLoaded = ref(false);

  // Apply theme to document element
  const applyTheme = () => {
    const theme = settings.value.theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  // Load saved settings
  const loadSettings = async () => {
    try {
      const saved = await databaseService.getSettings();
      if (saved && Object.keys(saved).length > 0) {
        settings.value = { ...DEFAULT_SETTINGS, ...saved };
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    } finally {
      isLoaded.value = true;
      applyTheme();
    }
  };

  // Update a single or multiple settings
  const updateSettings = async (updates: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...updates };
    applyTheme();
    try {
      await databaseService.saveSettings(updates);
    } catch (e) {
      console.warn('Failed to persist settings:', e);
    }

    if (updates.miniTimerAlwaysOnTop !== undefined) {
      await desktopService.setMiniAlwaysOnTop(updates.miniTimerAlwaysOnTop);
    }
    if (updates.miniTimerSize !== undefined) {
      await desktopService.setMiniWindowSize(updates.miniTimerSize);
    }
    if (updates.showFloatingMiniTimer !== undefined) {
      await desktopService.toggleMiniTimer(updates.showFloatingMiniTimer);
    }
  };

  const setMiniTimerSize = async (size: MiniTimerSize) => {
    await updateSettings({ miniTimerSize: size });
  };

  const toggleFloatingMiniTimer = async () => {
    const newState = !settings.value.showFloatingMiniTimer;
    await updateSettings({ showFloatingMiniTimer: newState });
  };

  // Listen to OS theme changes if theme is 'system'
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (settings.value.theme === 'system') {
        applyTheme();
      }
    });
  }

  return {
    settings,
    isLoaded,
    loadSettings,
    updateSettings,
    setMiniTimerSize,
    toggleFloatingMiniTimer,
    applyTheme,
  };
});
