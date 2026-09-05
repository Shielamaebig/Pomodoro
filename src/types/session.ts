import type { TimerMode } from './timer';

export interface PomodoroSession {
  id: string;
  taskId: string | null;
  taskTitle?: string;
  sessionType: TimerMode;
  startedAt: string; // ISO 8601
  endedAt: string;   // ISO 8601
  durationSeconds: number;
  completed: boolean;
}

export interface DaySessionsGroup {
  date: string;
  displayDate: string; // "Today", "Yesterday", or "Oct 12, 2026"
  totalFocusSeconds: number;
  completedPomodoros: number;
  sessions: PomodoroSession[];
}
