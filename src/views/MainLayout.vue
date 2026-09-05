<template>
  <div class="main-layout">
    <!-- Navigation Sidebar -->
    <aside class="sidebar">
      <!-- App Brand & Drag Handle -->
      <div class="brand titlebar-drag-region">
        <div class="brand-logo no-drag">🌳</div>
        <span class="brand-name no-drag">Pomodoro</span>
      </div>

      <!-- Navigation Links -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" active-class="active">
          <Clock :size="18" />
          <span>Timer</span>
        </router-link>

        <router-link to="/tasks" class="nav-item" active-class="active">
          <CheckSquare :size="18" />
          <span>Tasks</span>
          <span v-if="activeTasksCount > 0" class="nav-badge">
            {{ activeTasksCount }}
          </span>
        </router-link>

        <router-link to="/history" class="nav-item" active-class="active">
          <History :size="18" />
          <span>History</span>
        </router-link>

        <router-link to="/statistics" class="nav-item" active-class="active">
          <BarChart2 :size="18" />
          <span>Statistics</span>
        </router-link>

        <router-link to="/garden" class="nav-item" active-class="active">
          <Sprout :size="18" />
          <span>Garden</span>
        </router-link>
      </nav>

      <!-- Bottom Settings Link & Active Session Mini Glance -->
      <div class="sidebar-footer">
        <router-link to="/settings" class="nav-item" active-class="active">
          <Settings :size="18" />
          <span>Settings</span>
        </router-link>
      </div>
    </aside>

    <!-- Content Workspace -->
    <main class="content-area">
      <!-- Top Drag Bar for native desktop feeling -->
      <div class="window-titlebar-drag titlebar-drag-region"></div>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Clock, CheckSquare, History, BarChart2, Sprout, Settings } from 'lucide-vue-next';
import { useTaskStore } from '../stores/taskStore';

const taskStore = useTaskStore();
const activeTasksCount = computed(() => taskStore.tasks.filter((t) => !t.completed).length);
</script>

<style scoped>
.main-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bg-app);
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  user-select: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1.25rem 1.25rem 1rem;
}

.brand-logo {
  font-size: 1.35rem;
  line-height: 1;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0.5rem 0.75rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-item:hover {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-surface-hover);
  color: var(--accent-focus);
  font-weight: 600;
}

.nav-badge {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--bg-surface-active);
  color: var(--text-secondary);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.window-titlebar-drag {
  height: 24px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
