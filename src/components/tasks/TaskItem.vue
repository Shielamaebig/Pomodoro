<template>
  <div
    class="task-item"
    :class="{
      completed: task.completed,
      active: isActive,
    }"
  >
    <!-- Completion Checkbox -->
    <button
      class="checkbox-btn"
      :class="{ checked: task.completed }"
      :title="task.completed ? 'Mark uncompleted' : 'Mark completed'"
      @click.stop="$emit('toggle-complete', task.id)"
    >
      <Check v-if="task.completed" :size="14" stroke-width="3" />
    </button>

    <!-- Task Content -->
    <div class="task-info" @click="$emit('select-active', task.id)">
      <span class="task-title" :class="{ 'line-through': task.completed }">
        {{ task.title }}
      </span>

      <div class="task-meta">
        <span class="pomodoro-badge">
          🌳 {{ task.completedPomodoros }}/{{ task.estimatedPomodoros }}
        </span>
        <span v-if="isActive" class="active-badge">Active Task</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="task-actions">
      <button
        v-if="!task.completed && !isActive"
        class="action-btn select-btn"
        title="Set as current focus task"
        @click.stop="$emit('select-active', task.id)"
      >
        Select
      </button>

      <button
        class="action-btn delete-btn"
        title="Delete task"
        @click.stop="$emit('delete', task.id)"
      >
        <Trash2 :size="15" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Trash2 } from 'lucide-vue-next';
import type { Task } from '../../types/task';

defineProps<{
  task: Task;
  isActive: boolean;
}>();

defineEmits<{
  (e: 'toggle-complete', id: string): void;
  (e: 'select-active', id: string): void;
  (e: 'delete', id: string): void;
}>();
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.task-item:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}

.task-item.active {
  border-color: var(--accent-focus);
  background: var(--bg-surface-hover);
  box-shadow: 0 0 0 1px var(--accent-focus);
}

.task-item.completed {
  opacity: 0.6;
  background: var(--bg-app);
}

.checkbox-btn {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.checkbox-btn:hover {
  border-color: var(--accent-focus);
}

.checkbox-btn.checked {
  background: var(--accent-focus);
  border-color: var(--accent-focus);
  color: #ffffff;
}

.task-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.task-title {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-through {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pomodoro-badge {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.active-badge {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--accent-focus-light);
  color: var(--accent-focus);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  opacity: 0.8;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.action-btn {
  padding: 4px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.select-btn {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}

.select-btn:hover {
  border-color: var(--accent-focus);
  color: var(--accent-focus);
}

.delete-btn:hover {
  color: #EF4444;
}
</style>
