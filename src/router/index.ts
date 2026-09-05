import { createRouter, createWebHashHistory } from 'vue-router';
import MainLayout from '../views/MainLayout.vue';
import TimerView from '../views/TimerView.vue';
import TasksView from '../views/TasksView.vue';
import HistoryView from '../views/HistoryView.vue';
import StatisticsView from '../views/StatisticsView.vue';
import GardenView from '../views/GardenView.vue';
import SettingsView from '../views/SettingsView.vue';
import MiniTimerView from '../views/MiniTimerView.vue';

// Use hash history for guaranteed compatibility across desktop file:// and webview protocols
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'timer',
          component: TimerView,
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: TasksView,
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryView,
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: StatisticsView,
        },
        {
          path: 'garden',
          name: 'garden',
          component: GardenView,
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
        },
      ],
    },
    {
      path: '/mini',
      name: 'mini-timer',
      component: MiniTimerView,
    },
  ],
});

export default router;
