export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}
