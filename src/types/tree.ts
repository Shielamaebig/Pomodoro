export type TreeSpecies = 'oak' | 'pine' | 'cherry' | 'maple' | 'flowering';

export type TreeStage = 0 | 1 | 2 | 3 | 4 | 5;
// 0: Seed (0–10%)
// 1: Sprout (10–30%)
// 2: Small Plant (30–55%)
// 3: Young Tree (55–80%)
// 4: Large Mature Tree (80–99%)
// 5: Blooming / Completed Tree (100%)

export interface GardenTree {
  id: string;
  sessionId: string;
  species: TreeSpecies;
  stage: TreeStage;
  completed: boolean;
  plantedAt: string;
  completedAt: string;
  taskTitle?: string;
  durationMinutes: number;
}
