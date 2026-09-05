<template>
  <div class="history-view">
    <div class="view-header">
      <h2>Session History</h2>
      <p class="subtitle">Detailed log of your focus and rest intervals</p>
    </div>

    <!-- Empty State -->
    <div v-if="statsStore.groupedHistory.length === 0" class="empty-state">
      <span class="empty-icon">🕒</span>
      <h3>No sessions recorded yet</h3>
      <p>Complete your first Pomodoro session to see your activity timeline here.</p>
    </div>

    <!-- Grouped History List -->
    <div v-else class="history-groups">
      <div
        v-for="group in statsStore.groupedHistory"
        :key="group.date"
        class="date-group"
      >
        <div class="group-header">
          <span class="group-date">{{ group.displayDate }}</span>
          <span class="group-meta">
            🍅 {{ group.completedPomodoros }} sessions &bull;
            {{ Math.round(group.totalFocusSeconds / 60) }}m focused
          </span>
        </div>

        <div class="sessions-timeline">
          <div
            v-for="session in group.sessions"
            :key="session.id"
            class="timeline-item"
            :class="session.sessionType"
          >
            <div class="timeline-time tabular-nums">
              {{ formatTime(session.startedAt) }}
            </div>

            <div class="timeline-dot" :class="session.sessionType"></div>

            <div class="timeline-content">
              <div class="session-main">
                <span class="session-icon">
                  {{ session.sessionType === 'focus' ? '🍅' : '☕' }}
                </span>
                <span class="session-title">
                  {{ session.taskTitle || (session.sessionType === 'focus' ? 'Focus Session' : 'Rest Break') }}
                </span>
                <span v-if="!session.completed" class="interrupted-badge">Early</span>
              </div>
              <span class="session-duration tabular-nums">
                {{ formatDuration(session.durationSeconds) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatsStore } from '../stores/statsStore';

const statsStore = useStatsStore();

const formatTime = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (seconds: number) => {
  const mins = Math.round(seconds / 60);
  return `${mins} min${mins === 1 ? '' : 's'}`;
};
</script>

<style scoped>
.history-view {
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

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--bg-surface);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
  margin-top: 1rem;
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.empty-state h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.empty-state p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.date-group {
  margin-bottom: 1.75rem;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--border-subtle);
}

.group-date {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
}

.group-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.sessions-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.timeline-item:hover {
  border-color: var(--border-strong);
}

.timeline-time {
  font-size: 0.78rem;
  color: var(--text-muted);
  width: 60px;
  flex-shrink: 0;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-dot.focus {
  background: var(--accent-focus);
}

.timeline-dot.shortBreak {
  background: var(--accent-short-break);
}

.timeline-dot.longBreak {
  background: var(--accent-long-break);
}

.timeline-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.session-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.session-icon {
  font-size: 0.95rem;
}

.session-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.interrupted-badge {
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-hover);
  color: var(--text-muted);
}

.session-duration {
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-left: 0.5rem;
}
</style>
