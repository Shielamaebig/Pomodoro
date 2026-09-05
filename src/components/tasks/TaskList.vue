<template>
  <div class="task-list-container">
    <!-- Active Tasks Section -->
    <div class="section-header">
      <h3>Active Tasks ({{ uncompletedTasks.length }})</h3>
    </div>

    <div v-if="uncompletedTasks.length === 0" class="empty-state">
      <p>No active tasks. Add one to stay focused on your goals!</p>
    </div>

    <div v-else class="task-list">
      <TaskItem
        v-for="task in uncompletedTasks"
        :key="task.id"
        :task="task"
        :is-active="activeTaskId === task.id"
        @toggle-complete="$emit('toggle-complete', $event)"
        @select-active="$emit('select-active', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>

    <!-- Completed Tasks Section -->
    <div v-if="completedTasks.length > 0" class="completed-section">
      <button class="completed-toggle" @click="showCompleted = !showCompleted">
        <span>Completed ({{ completedTasks.length }})</span>
        <ChevronDown :size="16" :class="{ rotated: showCompleted }" />
      </button>

      <div v-if="showCompleted" class="task-list completed-list">
        <TaskItem
          v-for="task in completedTasks"
          :key="task.id"
          :task="task"
          :is-active="false"
          @toggle-complete="$emit('toggle-complete', $event)"
          @select-active="$emit('select-active', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import type { Task } from '../../types/task';
import TaskItem from './TaskItem.vue';

const props = defineProps<{
  tasks: Task[];
  activeTaskId: string | null;
}>();

defineEmits<{
  (e: 'toggle-complete', id: string): void;
  (e: 'select-active', id: string): void;
  (e: 'delete', id: string): void;
}>();

const showCompleted = ref(false);

const uncompletedTasks = computed(() => props.tasks.filter((t) => !t.completed));
const completedTasks = computed(() => props.tasks.filter((t) => t.completed));
</script>

<style scoped>
.task-list-container {
  display: flex;
  flex-direction: column;
}

.section-header {
  margin-bottom: 0.75rem;
}

.section-header h3 {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--bg-surface);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.88rem;
}

.task-list {
  display: flex;
  flex-direction: column;
}

.completed-section {
  margin-top: 1.5rem;
}

.completed-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 0.75rem;
}

.completed-toggle:hover {
  color: var(--text-primary);
}

.rotated {
  transform: rotate(180deg);
}

.completed-list {
  margin-top: 0.5rem;
}
</style>
