<template>
  <div class="garden-view">
    <div class="view-header">
      <h2>Focus Garden</h2>
      <p class="subtitle">Every focused session plants a seed that grows into your sanctuary</p>
    </div>

    <!-- Today's Harvest Ribbon -->
    <div class="today-ribbon">
      <div class="ribbon-col">
        <span class="ribbon-label">Today's Sanctuary</span>
        <div class="ribbon-val">
          <span>🌳 {{ todayTreesCount }} trees grown</span>
          <span class="dot">&bull;</span>
          <span class="tabular-nums">{{ Math.floor(statsStore.todayFocusMinutes / 60) }}h {{ statsStore.todayFocusMinutes % 60 }}m focused</span>
        </div>
      </div>

      <!-- Growth Species Legend -->
      <div class="growth-legend">
        <div class="legend-item" title="Oak">
          <span class="species-chip oak">Oak</span>
        </div>
        <div class="legend-item" title="Pine">
          <span class="species-chip pine">Pine</span>
        </div>
        <div class="legend-item" title="Cherry Blossom">
          <span class="species-chip cherry">Sakura</span>
        </div>
        <div class="legend-item" title="Maple">
          <span class="species-chip maple">Maple</span>
        </div>
        <div class="legend-item" title="Flowering">
          <span class="species-chip flowering">Bloom</span>
        </div>
      </div>
    </div>

    <!-- Empty Garden -->
    <div v-if="allDisplayItems.length === 0" class="empty-garden">
      <div class="empty-pot">
        <TreeIllustration species="oak" :stage="0" :size="72" />
      </div>
      <h3>Your garden is waiting for its first seed</h3>
      <p>Start a 25-minute Focus session to plant and grow your first tree!</p>
    </div>

    <!-- Garden Sanctuary Grid -->
    <div v-else class="garden-plot-card">
      <div class="plot-soil">
        <div
          v-for="item in allDisplayItems"
          :key="item.id"
          class="plant-plot-cell"
          :title="`${item.title} (${item.date})`"
          @click="selectedItem = item"
        >
          <div class="plant-visual-wrap" :class="{ completed: item.completed }">
            <TreeIllustration
              v-if="item.isTree"
              :species="item.species"
              :stage="item.stage"
              :size="52"
              :is-celebration="item.completed"
            />
            <span v-else class="plant-emoji">{{ item.emoji }}</span>
          </div>
          <span class="plant-name-label">{{ item.title }}</span>
          <span class="plant-date-label">{{ item.date }}</span>
        </div>
      </div>
    </div>

    <!-- Selected Plant Detail Modal -->
    <div v-if="selectedItem" class="tree-detail-modal-overlay" @click.self="selectedItem = null">
      <div class="tree-detail-card">
        <div class="modal-tree-preview">
          <TreeIllustration
            v-if="selectedItem.isTree"
            :species="selectedItem.species"
            :stage="selectedItem.stage"
            :size="96"
            :is-celebration="selectedItem.completed"
          />
          <span v-else class="large-modal-emoji">{{ selectedItem.emoji }}</span>
        </div>

        <h3>{{ selectedItem.title }}</h3>
        <p class="modal-date">{{ selectedItem.date }}</p>

        <div class="modal-details-grid">
          <div v-if="selectedItem.taskTitle" class="detail-row">
            <span class="detail-label">Task</span>
            <span class="detail-val">{{ selectedItem.taskTitle }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-val status-badge" :class="{ done: selectedItem.completed }">
              {{ selectedItem.completed ? 'Fully Grown 🌳' : 'Sprouted 🌱' }}
            </span>
          </div>
          <div v-if="selectedItem.durationMinutes" class="detail-row">
            <span class="detail-label">Focus Time</span>
            <span class="detail-val">{{ selectedItem.durationMinutes }} minutes</span>
          </div>
        </div>

        <button class="modal-close-btn" @click="selectedItem = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStatsStore } from '../stores/statsStore';
import type { TreeSpecies, TreeStage } from '../types/tree';
import TreeIllustration from '../components/tree/TreeIllustration.vue';

const statsStore = useStatsStore();
const selectedItem = ref<any>(null);

const todayTreesCount = computed(() => {
  if (statsStore.trees.length > 0) {
    return statsStore.todayTrees.filter((t) => t.completed).length;
  }
  return statsStore.todayPomodoros;
});

const speciesNames: Record<TreeSpecies, string> = {
  oak: 'Mighty Oak',
  pine: 'Alpine Pine',
  cherry: 'Sakura Blossom',
  maple: 'Golden Maple',
  flowering: 'Blooming Magnolia',
};

interface GardenDisplayItem {
  id: string;
  isTree: boolean;
  species: TreeSpecies;
  stage: TreeStage;
  completed: boolean;
  title: string;
  date: string;
  taskTitle?: string;
  durationMinutes: number;
  emoji?: string;
}

const allDisplayItems = computed<GardenDisplayItem[]>(() => {
  // If we have recorded garden trees, display them with priority
  if (statsStore.trees.length > 0) {
    return statsStore.trees.map((t) => {
      const d = new Date(t.plantedAt);
      const isToday = new Date().toDateString() === d.toDateString();
      const dateStr = isToday ? 'Today' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      return {
        id: t.id,
        isTree: true,
        species: t.species,
        stage: t.stage,
        completed: t.completed,
        title: speciesNames[t.species] || 'Focus Tree',
        date: dateStr,
        taskTitle: t.taskTitle,
        durationMinutes: t.durationMinutes,
        emoji: '🌳',
      };
    });
  }

  // Fallback to legacy simulated garden plants if no trees recorded yet
  return statsStore.gardenPlants.map((p) => ({
    id: p.id,
    isTree: false,
    species: 'oak' as TreeSpecies,
    stage: 4 as TreeStage,
    completed: true,
    emoji: p.emoji,
    title: p.label,
    date: p.date,
    taskTitle: undefined,
    durationMinutes: p.pomodoroValue * 25,
  }));
});
</script>

<style scoped>
.garden-view {
  padding: 1.5rem 2rem;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.view-header {
  margin-bottom: 1.25rem;
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

.today-ribbon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  gap: 1rem;
}

.ribbon-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ribbon-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.ribbon-val {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dot {
  color: var(--text-muted);
}

.growth-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.species-chip {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface-hover);
  color: var(--text-secondary);
}

.species-chip.oak { color: #2E7D32; border-color: rgba(46, 125, 50, 0.3); }
.species-chip.pine { color: #1B5E20; border-color: rgba(27, 94, 32, 0.3); }
.species-chip.cherry { color: #E91E63; border-color: rgba(233, 30, 99, 0.3); }
.species-chip.maple { color: #E65100; border-color: rgba(230, 81, 0, 0.3); }
.species-chip.flowering { color: #43A047; border-color: rgba(67, 160, 71, 0.3); }

.empty-garden {
  text-align: center;
  padding: 3.5rem 1.5rem;
  background: var(--bg-surface);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
  margin-top: 1rem;
}

.empty-pot {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.empty-garden h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}

.empty-garden p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.garden-plot-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.plot-soil {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 1.25rem;
  background: var(--bg-app);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  border: 1px solid var(--border-subtle);
}

.plant-plot-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.plant-plot-cell:hover {
  transform: translateY(-2px);
}

.plant-visual-wrap {
  width: 64px;
  height: 64px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.plant-plot-cell:hover .plant-visual-wrap {
  border-color: var(--accent-focus, #10B981);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.plant-emoji {
  font-size: 2rem;
  line-height: 1;
}

.plant-name-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.plant-date-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 1px;
}

/* Modal Overlay */
.tree-detail-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tree-detail-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.modal-tree-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.tree-detail-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-date {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.modal-details-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  text-align: left;
  background: var(--bg-app);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.detail-label {
  color: var(--text-muted);
  font-weight: 500;
}

.detail-val {
  color: var(--text-primary);
  font-weight: 600;
}

.status-badge.done {
  color: #10B981;
}

.modal-close-btn {
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-subtle);
  padding: 6px 18px;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
}

.modal-close-btn:hover {
  background: var(--border-subtle);
}
</style>
