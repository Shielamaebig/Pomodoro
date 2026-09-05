<template>
  <div class="tasks-view">
    <div class="view-header">
      <div class="header-titles">
        <h2>Tasks</h2>
        <p class="subtitle">Organize and assign your Pomodoro sessions</p>
      </div>
    </div>

    <!-- Add Task Form -->
    <TaskForm @create-task="handleCreateTask" />

    <!-- Task List -->
    <TaskList
      :tasks="taskStore.tasks"
      :active-task-id="taskStore.activeTaskId"
      @toggle-complete="taskStore.toggleTaskComplete"
      @select-active="taskStore.setActiveTask"
      @delete="taskStore.deleteTask"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '../stores/taskStore';
import TaskForm from '../components/tasks/TaskForm.vue';
import TaskList from '../components/tasks/TaskList.vue';

const taskStore = useTaskStore();

const handleCreateTask = async (payload: { title: string; estimatedPomodoros: number }) => {
  await taskStore.createTask(payload.title, payload.estimatedPomodoros);
};
</script>

<style scoped>
.tasks-view {
  padding: 1.5rem 2rem;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.view-header {
  margin-bottom: 1.25rem;
}

.header-titles h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 2px;
}
</style>
