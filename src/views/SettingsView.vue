<template>
  <div class="settings-view">
    <div class="view-header">
      <h2>Settings</h2>
      <p class="subtitle">Customize timer durations, desktop behavior, and theme</p>
    </div>

    <div class="settings-sections">
      <!-- Timer Durations Section -->
      <section class="settings-card">
        <h3 class="section-title">Timer Durations</h3>
        
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Focus Duration</span>
            <span class="setting-desc">Length of each deep focus session</span>
          </div>
          <div class="setting-control">
            <input
              type="number"
              min="1"
              max="120"
              :value="settingsStore.settings.focusDuration"
              class="number-input"
              @change="updateFocusDuration"
            />
            <span class="unit">min</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Short Break</span>
            <span class="setting-desc">Rest interval between focus sessions</span>
          </div>
          <div class="setting-control">
            <input
              type="number"
              min="1"
              max="60"
              :value="settingsStore.settings.shortBreakDuration"
              class="number-input"
              @change="updateShortBreakDuration"
            />
            <span class="unit">min</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Long Break</span>
            <span class="setting-desc">Extended rest after completing a cycle</span>
          </div>
          <div class="setting-control">
            <input
              type="number"
              min="1"
              max="90"
              :value="settingsStore.settings.longBreakDuration"
              class="number-input"
              @change="updateLongBreakDuration"
            />
            <span class="unit">min</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Long Break Every</span>
            <span class="setting-desc">Number of Pomodoros before a long break</span>
          </div>
          <div class="setting-control">
            <input
              type="number"
              min="1"
              max="12"
              :value="settingsStore.settings.longBreakInterval"
              class="number-input"
              @change="updateLongBreakInterval"
            />
            <span class="unit">sessions</span>
          </div>
        </div>
      </section>

      <!-- Automation & Behavior Section -->
      <section class="settings-card">
        <h3 class="section-title">Behavior & Automation</h3>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Automatically start breaks</span>
            <span class="setting-desc">Immediately begin the break countdown when focus ends</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.autoStartBreaks"
              @change="toggleAutoStartBreaks"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Automatically start focus sessions</span>
            <span class="setting-desc">Begin next focus session when break countdown expires</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.autoStartFocus"
              @change="toggleAutoStartFocus"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Minimize to system tray</span>
            <span class="setting-desc">Keep running in tray when closing the main window</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.minimizeToTray"
              @change="toggleMinimizeToTray"
            />
            <span class="slider"></span>
          </label>
        </div>
      </section>

      <!-- Floating Mini Timer Section -->
      <section class="settings-card">
        <h3 class="section-title">Floating Focus Widget</h3>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Auto-hide main app on focus start</span>
            <span class="setting-desc">Minimizes main app and shows floating focus tree widget when session begins</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.autoHideOnFocusStart"
              @change="toggleAutoHideOnFocusStart"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Show floating focus widget</span>
            <span class="setting-desc">Display secondary floating window on desktop</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.showFloatingMiniTimer"
              @change="settingsStore.toggleFloatingMiniTimer"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Always keep mini timer on top</span>
            <span class="setting-desc">Floats above other applications while you work</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.miniTimerAlwaysOnTop"
              @change="toggleMiniTimerAlwaysOnTop"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Show task in mini timer</span>
            <span class="setting-desc">Display active task name on expanded mini timer</span>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              :checked="settingsStore.settings.showTaskInMiniTimer"
              @change="toggleShowTaskInMiniTimer"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Mini Timer Size</span>
            <span class="setting-desc">Choose between Compact, Normal, or Expanded</span>
          </div>
          <div class="pill-group">
            <button
              class="pill-btn"
              :class="{ active: settingsStore.settings.miniTimerSize === 'compact' }"
              @click="settingsStore.setMiniTimerSize('compact')"
            >
              Compact
            </button>
            <button
              class="pill-btn"
              :class="{ active: settingsStore.settings.miniTimerSize === 'normal' }"
              @click="settingsStore.setMiniTimerSize('normal')"
            >
              Normal
            </button>
            <button
              class="pill-btn"
              :class="{ active: settingsStore.settings.miniTimerSize === 'expanded' }"
              @click="settingsStore.setMiniTimerSize('expanded')"
            >
              Expanded
            </button>
          </div>
        </div>
      </section>

      <!-- Notifications & Audio Section -->
      <section class="settings-card">
        <h3 class="section-title">Notifications</h3>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Desktop notifications</span>
            <span class="setting-desc">Show native alert when sessions finish</span>
          </div>
          <div class="control-with-test">
            <button class="test-btn" @click="testNotification">Test</button>
            <label class="switch">
              <input
                type="checkbox"
                :checked="settingsStore.settings.desktopNotifications"
                @change="toggleDesktopNotifications"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="toggle-row">
          <div class="setting-info">
            <span class="setting-label">Notification sound</span>
            <span class="setting-desc">Play a gentle bell chime when time is up</span>
          </div>
          <div class="control-with-test">
            <button class="test-btn" @click="testSound">Play</button>
            <label class="switch">
              <input
                type="checkbox"
                :checked="settingsStore.settings.notificationSound"
                @change="toggleNotificationSound"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Appearance Section -->
      <section class="settings-card">
        <h3 class="section-title">Appearance</h3>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Theme</span>
            <span class="setting-desc">Select visual color mode</span>
          </div>
          <div class="pill-group">
            <button
              class="pill-btn"
              :class="{ active: settingsStore.settings.theme === 'system' }"
              @click="setTheme('system')"
            >
              System
            </button>
            <button
              class="pill-btn"
              :class="{ active: settingsStore.settings.theme === 'light' }"
              @click="setTheme('light')"
            >
              Light
            </button>
            <button
              class="pill-btn"
              :class="{ active: settingsStore.settings.theme === 'dark' }"
              @click="setTheme('dark')"
            >
              Dark
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../stores/settingsStore';
import { useTimerStore } from '../stores/timerStore';
import { notificationService } from '../services/notificationService';

const settingsStore = useSettingsStore();
const timerStore = useTimerStore();

const updateFocusDuration = (e: Event) => {
  const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 25);
  settingsStore.updateSettings({ focusDuration: val });
  if (timerStore.mode === 'focus' && timerStore.status === 'idle') {
    timerStore.reset();
  }
};

const updateShortBreakDuration = (e: Event) => {
  const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 5);
  settingsStore.updateSettings({ shortBreakDuration: val });
  if (timerStore.mode === 'shortBreak' && timerStore.status === 'idle') {
    timerStore.reset();
  }
};

const updateLongBreakDuration = (e: Event) => {
  const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 15);
  settingsStore.updateSettings({ longBreakDuration: val });
  if (timerStore.mode === 'longBreak' && timerStore.status === 'idle') {
    timerStore.reset();
  }
};

const updateLongBreakInterval = (e: Event) => {
  const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 4);
  settingsStore.updateSettings({ longBreakInterval: val });
};

const toggleAutoStartBreaks = (e: Event) => {
  settingsStore.updateSettings({ autoStartBreaks: (e.target as HTMLInputElement).checked });
};

const toggleAutoStartFocus = (e: Event) => {
  settingsStore.updateSettings({ autoStartFocus: (e.target as HTMLInputElement).checked });
};

const toggleAutoHideOnFocusStart = (e: Event) => {
  settingsStore.updateSettings({ autoHideOnFocusStart: (e.target as HTMLInputElement).checked });
};

const toggleMinimizeToTray = (e: Event) => {
  settingsStore.updateSettings({ minimizeToTray: (e.target as HTMLInputElement).checked });
};

const toggleMiniTimerAlwaysOnTop = (e: Event) => {
  settingsStore.updateSettings({ miniTimerAlwaysOnTop: (e.target as HTMLInputElement).checked });
};

const toggleShowTaskInMiniTimer = (e: Event) => {
  settingsStore.updateSettings({ showTaskInMiniTimer: (e.target as HTMLInputElement).checked });
};

const toggleDesktopNotifications = async (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  if (checked) {
    await notificationService.requestPermission();
  }
  settingsStore.updateSettings({ desktopNotifications: checked });
};

const toggleNotificationSound = (e: Event) => {
  settingsStore.updateSettings({ notificationSound: (e.target as HTMLInputElement).checked });
};

const setTheme = (theme: 'system' | 'light' | 'dark') => {
  settingsStore.updateSettings({ theme });
};

const testNotification = async () => {
  await notificationService.requestPermission();
  notificationService.notify('🌳 Focus Complete', 'Great work. Time for a short break.');
};

const testSound = () => {
  notificationService.playChime();
};
</script>

<style scoped>
.settings-view {
  padding: 1.5rem 2rem;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.view-header {
  margin-bottom: 1.5rem;
}

.view-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.settings-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 0.88rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.setting-row, .toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0;
}

.setting-row:not(:last-child), .toggle-row:not(:last-child) {
  border-bottom: 1px dashed var(--border-subtle);
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 70%;
}

.setting-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.number-input {
  width: 54px;
  padding: 5px 8px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  background: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 600;
  text-align: center;
  outline: none;
}

.number-input:focus {
  border-color: var(--accent-focus);
}

.unit {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.pill-group {
  display: flex;
  background: var(--bg-app);
  padding: 3px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  gap: 3px;
}

.pill-btn {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.pill-btn.active {
  background: var(--bg-surface);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.control-with-test {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.test-btn {
  font-size: 0.75rem;
  padding: 3px 8px;
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.test-btn:hover {
  background: var(--bg-surface-active);
  color: var(--text-primary);
}

/* Switch Toggle Component */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--border-strong);
  transition: 0.25s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.25s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent-focus);
}

input:checked + .slider:before {
  transform: translateX(16px);
}
</style>
