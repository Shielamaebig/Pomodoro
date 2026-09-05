<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <div class="input-row">
      <input
        v-model="title"
        type="text"
        class="task-input"
        placeholder="Add a new task... (e.g. Build API)"
        maxlength="80"
        required
      />

      <div class="estimate-wrapper" title="Estimated Pomodoros">
        <span class="estimate-icon">🍅</span>
        <input
          v-model.number="estimate"
          type="number"
          min="1"
          max="20"
          class="estimate-input"
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="!title.trim()">
        <Plus :size="16" />
        <span>Add</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'create-task', payload: { title: string; estimatedPomodoros: number }): void;
}>();

const title = ref('');
const estimate = ref(1);

const handleSubmit = () => {
  if (!title.value.trim()) return;
  emit('create-task', {
    title: title.value.trim(),
    estimatedPomodoros: Number(estimate.value) || 1,
  });
  title.value = '';
  estimate.value = 1;
};
</script>

<style scoped>
.task-form {
  margin-bottom: 1.25rem;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 4px 6px 4px 12px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.input-row:focus-within {
  border-color: var(--accent-focus);
  box-shadow: 0 0 0 1px var(--accent-focus);
}

.task-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.92rem;
  color: var(--text-primary);
  outline: none;
}

.task-input::placeholder {
  color: var(--text-muted);
}

.estimate-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-surface-hover);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.estimate-icon {
  font-size: 0.9rem;
}

.estimate-input {
  width: 32px;
  border: none;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  text-align: center;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--accent-focus);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.submit-btn:hover:not(:disabled) {
  background: #cf381f;
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
