import type { TreeSpecies, TreeStage } from './tree';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  startedAt: number | null;
  endsAt: number | null;
  remainingSeconds: number;
  totalDurationSeconds: number;
  completedPomodoros: number;
  currentTaskId: string | null;
  treeSpecies?: TreeSpecies;
  treeStage?: TreeStage;
}

export type MiniTimerSize = 'compact' | 'normal' | 'expanded' | 'focus';

export interface TimerActionMessage {
  action: 'start' | 'pause' | 'resume' | 'reset' | 'skip' | 'finish-early' | 'set-mode' | 'open-main' | 'open-settings';
  mode?: TimerMode;
  taskId?: string | null;
}
