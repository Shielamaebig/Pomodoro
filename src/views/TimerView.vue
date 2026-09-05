<template>
  <div class="timer-view">
    <!-- Active Task Ribbon / Selection -->
    <div class="active-task-bar">
      <div v-if="taskStore.activeTask" class="active-task-content">
        <span class="working-on-label">Working on:</span>
        <span class="task-name" :title="taskStore.activeTask.title">
          {{ taskStore.activeTask.title }}
        </span>
        <button
          class="clear-task-btn"
          title="Detach current task"
          @click="taskStore.setActiveTask(null)"
        >
          <X :size="13" />
        </button>
      </div>

      <div v-else class="no-task-content">
        <span class="working-on-label">No task selected</span>
        <router-link to="/tasks" class="select-task-link">
          Choose a task &rarr;
        </router-link>
      </div>
    </div>

    <!-- Main Timer Display & Circular Ring -->
    <TimerDisplay
      :mode="timerStore.mode"
      :status="timerStore.status"
      :formatted-time="timerStore.formattedTime"
      :progress="timerStore.progress"
      :tree-species="timerStore.currentTreeSpecies"
      :tree-stage="timerStore.currentTreeStage"
      @change-mode="timerStore.setMode"
    />

    <!-- Session Indicator (4-cycle pomodoro loop) -->
    <SessionIndicator
      :completed-pomodoros="timerStore.completedPomodoros"
      :total-cycle="settingsStore.settings.longBreakInterval"
      :is-focus-running="timerStore.mode === 'focus' && timerStore.status === 'running'"
    />

    <!-- Main Controls -->
    <TimerControls
      :mode="timerStore.mode"
      :status="timerStore.status"
      @start="timerStore.start"
      @pause="timerStore.pause"
      @resume="timerStore.resume"
      @reset="timerStore.reset"
      @skip="timerStore.skip"
      @finish-early="timerStore.finishEarly"
    />

    <!-- Mini Timer Floating Window Quick Launcher -->
    <div class="mini-timer-dock">
      <button
        class="mini-dock-btn"
        :class="{ active: settingsStore.settings.showFloatingMiniTimer }"
        @click="settingsStore.toggleFloatingMiniTimer"
      >
        <ExternalLink :size="14" />
        <span>{{ settingsStore.settings.showFloatingMiniTimer ? 'Hide Floating Focus Widget' : 'Pop out Focus Widget' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, ExternalLink } from 'lucide-vue-next';
import { useTimerStore } from '../stores/timerStore';
import { useTaskStore } from '../stores/taskStore';
import { useSettingsStore } from '../stores/settingsStore';
import TimerDisplay from '../components/timer/TimerDisplay.vue';
import TimerControls from '../components/timer/TimerControls.vue';
import SessionIndicator from '../components/timer/SessionIndicator.vue';

const timerStore = useTimerStore();
const taskStore = useTaskStore();
const settingsStore = useSettingsStore();
</script>

<style scoped>
.timer-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
}

.active-task-bar {
  margin-bottom: 0.5rem;
}

.active-task-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

.no-task-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.working-on-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-muted);
}

.task-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-task-btn {
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.clear-task-btn:hover {
  color: #EF4444;
}

.select-task-link {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--accent-focus);
  text-decoration: none;
}

.select-task-link:hover {
  text-decoration: underline;
}

.mini-timer-dock {
  margin-top: 1.75rem;
}

.mini-dock-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 5px 12px;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.mini-dock-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.mini-dock-btn.active {
  background: var(--accent-focus-light);
  color: var(--accent-focus);
  border-color: var(--accent-focus);
}
</style>
