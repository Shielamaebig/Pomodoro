import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '../types/task';
import { databaseService } from '../services/databaseService';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);
  const activeTaskId = ref<string | null>(null);
  const isLoaded = ref(false);

  const activeTask = computed(() => {
    return tasks.value.find((t) => t.id === activeTaskId.value) || null;
  });

  const loadTasks = async () => {
    try {
      tasks.value = await databaseService.getTasks();
    } catch (e) {
      console.warn('Failed to load tasks:', e);
    } finally {
      isLoaded.value = true;
    }
  };

  const createTask = async (title: string, estimatedPomodoros = 1): Promise<Task> => {
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      estimatedPomodoros: Math.max(1, estimatedPomodoros),
      completedPomodoros: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.value.unshift(newTask);
    await databaseService.saveTask(newTask);

    // If no active task, set this as active
    if (!activeTaskId.value) {
      activeTaskId.value = newTask.id;
    }

    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;

    Object.assign(task, updates);
    await databaseService.saveTask(task);
  };

  const toggleTaskComplete = async (id: string): Promise<void> => {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : undefined;
    await databaseService.saveTask(task);

    if (task.completed && activeTaskId.value === id) {
      // Find next uncompleted task
      const next = tasks.value.find((t) => !t.completed);
      activeTaskId.value = next ? next.id : null;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
    if (activeTaskId.value === id) {
      const next = tasks.value.find((t) => !t.completed);
      activeTaskId.value = next ? next.id : null;
    }
    await databaseService.deleteTask(id);
  };

  const incrementTaskPomodoro = async (id: string): Promise<void> => {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;

    task.completedPomodoros += 1;
    await databaseService.saveTask(task);
  };

  const setActiveTask = (id: string | null) => {
    activeTaskId.value = id;
  };

  return {
    tasks,
    activeTaskId,
    activeTask,
    isLoaded,
    loadTasks,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    incrementTaskPomodoro,
    setActiveTask,
  };
});
