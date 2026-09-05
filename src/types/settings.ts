import type { MiniTimerSize } from './timer';
export type { MiniTimerSize };

export interface AppSettings {
  focusDuration: number;       // in minutes (default 25)
  shortBreakDuration: number;  // in minutes (default 5)
  longBreakDuration: number;   // in minutes (default 15)
  longBreakInterval: number;   // sessions before long break (default 4)
  
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  
  minimizeToTray: boolean;
  showFloatingMiniTimer: boolean;
  miniTimerAlwaysOnTop: boolean;
  miniTimerSize: MiniTimerSize;
  miniWidgetStyle: 'focus' | 'compact';
  showTaskInMiniTimer: boolean;
  autoHideOnFocusStart: boolean;
  
  desktopNotifications: boolean;
  notificationSound: boolean;
  
  theme: 'system' | 'light' | 'dark';
}

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,

  autoStartBreaks: true,
  autoStartFocus: false,

  minimizeToTray: true,
  showFloatingMiniTimer: false,
  miniTimerAlwaysOnTop: true,
  miniTimerSize: 'normal',
  miniWidgetStyle: 'focus',
  showTaskInMiniTimer: true,
  autoHideOnFocusStart: true,

  desktopNotifications: true,
  notificationSound: true,

  theme: 'system',
};
