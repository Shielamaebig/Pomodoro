import { isTauri } from './desktopService';

export class NotificationService {
  private static instance: NotificationService;
  private audioCtx: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request permission
  public async requestPermission(): Promise<boolean> {
    if (isTauri()) {
      try {
        const { isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification');
        let granted = await isPermissionGranted();
        if (!granted) {
          const permission = await requestPermission();
          granted = permission === 'granted';
        }
        return granted;
      } catch (e) {
        console.warn('Tauri notification permission check failed:', e);
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
    }
    return false;
  }

  // Send desktop notification
  public async notify(title: string, body: string): Promise<void> {
    if (isTauri()) {
      try {
        const { sendNotification } = await import('@tauri-apps/plugin-notification');
        sendNotification({ title, body });
        return;
      } catch (e) {
        console.warn('Failed to send Tauri notification:', e);
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/tomato.svg' });
      } catch (e) {
        console.warn('Failed to send Web Notification:', e);
      }
    }
  }

  // High-fidelity synthesized meditation/bell chime using Web Audio API
  public playChime(): void {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Create a harmonious dual-tone chime (528Hz & 792Hz - perfect 5th)
      const frequencies = [528, 792];
      frequencies.forEach((freq, index) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        // Natural exponential decay envelope
        const startTime = now + index * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.8);
      });
    } catch (e) {
      console.warn('Audio chime playback failed:', e);
    }
  }
}

export const notificationService = NotificationService.getInstance();
