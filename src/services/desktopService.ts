import type { TimerState, TimerActionMessage, MiniTimerSize } from '../types/timer';

export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

// Cross-window Event Names
export const TIMER_STATE_EVENT = 'pomodoro://timer-state-update';
export const TIMER_ACTION_EVENT = 'pomodoro://timer-action';

export class DesktopService {
  private static instance: DesktopService;

  private constructor() {}

  public static getInstance(): DesktopService {
    if (!DesktopService.instance) {
      DesktopService.instance = new DesktopService();
    }
    return DesktopService.instance;
  }

  // --- Window Dragging ---
  public async startDragging(): Promise<void> {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().startDragging();
    } catch (e) {
      console.warn('Failed to start dragging window:', e);
    }
  }

  // --- Main Window Operations ---
  public async showMainWindow(): Promise<void> {
    if (!isTauri()) return;
    try {
      const { Window } = await import('@tauri-apps/api/window');
      const mainWin = await Window.getByLabel('main');
      if (mainWin) {
        await mainWin.show();
        await mainWin.unminimize();
        await mainWin.setFocus();
      }
    } catch (e) {
      console.warn('Failed to show main window:', e);
    }
  }

  public async hideMainWindow(): Promise<void> {
    if (!isTauri()) return;
    try {
      const { Window } = await import('@tauri-apps/api/window');
      const mainWin = await Window.getByLabel('main');
      if (mainWin) {
        await mainWin.hide();
      }
    } catch (e) {
      console.warn('Failed to hide main window:', e);
    }
  }

  // --- Mini Timer Window Operations ---
  public async showMiniTimer(): Promise<void> {
    if (!isTauri()) return;
    try {
      const { Window } = await import('@tauri-apps/api/window');
      const miniWin = await Window.getByLabel('mini');
      if (miniWin) {
        try {
          await miniWin.setShadow(false);
        } catch {
          // Handled via native backend
        }
        try {
          await this.restoreMiniPosition();
        } catch (e) {
          console.warn('Could not restore mini position:', e);
        }
        await miniWin.show();
        await miniWin.unminimize();
        await miniWin.setAlwaysOnTop(true);
      }
    } catch (e) {
      console.warn('Failed to show mini timer window:', e);
    }
  }

  public async hideMiniTimer(): Promise<void> {
    if (!isTauri()) return;
    try {
      try {
        await this.saveMiniPosition();
      } catch (e) {
        console.warn('Could not save mini position:', e);
      }
      const { Window } = await import('@tauri-apps/api/window');
      const miniWin = await Window.getByLabel('mini');
      if (miniWin) {
        await miniWin.hide();
      }
    } catch (e) {
      console.warn('Failed to hide mini timer window:', e);
    }
  }

  public async toggleMiniTimer(show: boolean): Promise<void> {
    if (show) {
      await this.showMiniTimer();
    } else {
      await this.hideMiniTimer();
    }
  }

  public async saveMiniPosition(): Promise<void> {
    if (!isTauri()) return;
    try {
      const { Window } = await import('@tauri-apps/api/window');
      const miniWin = await Window.getByLabel('mini');
      if (miniWin) {
        const pos = await miniWin.outerPosition();
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number' && pos.x >= 0 && pos.y >= 0) {
          localStorage.setItem('pomodoro_mini_pos', JSON.stringify({ x: pos.x, y: pos.y }));
        }
      }
    } catch (e) {
      console.warn('Failed to save mini window position:', e);
    }
  }

  public async restoreMiniPosition(): Promise<void> {
    if (!isTauri()) return;
    try {
      const saved = localStorage.getItem('pomodoro_mini_pos');
      if (!saved) return;
      const { x, y } = JSON.parse(saved);
      if (typeof x === 'number' && typeof y === 'number' && !isNaN(x) && !isNaN(y) && x >= 0 && y >= 0) {
        const { Window, PhysicalPosition } = await import('@tauri-apps/api/window');
        const miniWin = await Window.getByLabel('mini');
        if (miniWin) {
          await miniWin.setPosition(new PhysicalPosition(x, y));
        }
      }
    } catch (e) {
      console.warn('Failed to restore mini window position:', e);
    }
  }

  public async setMiniWindowSize(size: MiniTimerSize | 'focus' | 'compact'): Promise<void> {
    if (!isTauri()) return;
    try {
      const { Window, LogicalSize } = await import('@tauri-apps/api/window');
      const miniWin = await Window.getByLabel('mini');
      if (!miniWin) return;

      // Sizing for floating widget: Focus (~232x212) vs Compact (~252x80) to accommodate rounded shadow
      let width = 232;
      let height = 212;
      if (size === 'compact') {
        width = 252;
        height = 80;
      }
      await miniWin.setSize(new LogicalSize(width, height));
    } catch (e) {
      console.warn('Failed to resize mini timer window:', e);
    }
  }

  public async setMiniAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
    if (!isTauri()) return;
    try {
      const { Window } = await import('@tauri-apps/api/window');
      const miniWin = await Window.getByLabel('mini');
      if (miniWin) {
        await miniWin.setAlwaysOnTop(alwaysOnTop);
      }
    } catch (e) {
      console.warn('Failed to set always on top:', e);
    }
  }

  // --- Inter-Process Communication (IPC) Events ---
  public async emitTimerState(state: TimerState): Promise<void> {
    if (!isTauri()) return;
    try {
      const { emit } = await import('@tauri-apps/api/event');
      await emit(TIMER_STATE_EVENT, state);
    } catch (e) {
      console.warn('Failed to emit timer state event:', e);
    }
  }

  public async onTimerState(callback: (state: TimerState) => void): Promise<() => void> {
    if (!isTauri()) return () => {};
    try {
      const { listen } = await import('@tauri-apps/api/event');
      const unlisten = await listen<TimerState>(TIMER_STATE_EVENT, (event) => {
        callback(event.payload);
      });
      return unlisten;
    } catch (e) {
      console.warn('Failed to listen to timer state:', e);
      return () => {};
    }
  }

  public async emitTimerAction(action: TimerActionMessage): Promise<void> {
    if (!isTauri()) return;
    try {
      const { emit } = await import('@tauri-apps/api/event');
      await emit(TIMER_ACTION_EVENT, action);
    } catch (e) {
      console.warn('Failed to emit timer action event:', e);
    }
  }

  public async onTimerAction(callback: (action: TimerActionMessage) => void): Promise<() => void> {
    if (!isTauri()) return () => {};
    try {
      const { listen } = await import('@tauri-apps/api/event');
      const unlisten = await listen<TimerActionMessage>(TIMER_ACTION_EVENT, (event) => {
        callback(event.payload);
      });
      return unlisten;
    } catch (e) {
      console.warn('Failed to listen to timer actions:', e);
      return () => {};
    }
  }
}

export const desktopService = DesktopService.getInstance();
