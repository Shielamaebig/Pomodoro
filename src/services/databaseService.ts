import type { Task } from '../types/task';
import type { PomodoroSession } from '../types/session';
import type { AppSettings } from '../types/settings';
import type { GardenTree, TreeSpecies, TreeStage } from '../types/tree';
import { isTauri } from './desktopService';
import type Database from '@tauri-apps/plugin-sql';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    if (isTauri()) {
      try {
        const Database = (await import('@tauri-apps/plugin-sql')).default;
        this.db = await Database.load('sqlite:pomodoro.db');
        await this.createTables();
        this.initialized = true;
        return;
      } catch (e) {
        console.warn('Failed to load Tauri SQLite plugin, falling back to local storage:', e);
      }
    }

    // Web fallback
    this.initLocalStorageFallback();
    this.initialized = true;
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        estimated_pomodoros INTEGER DEFAULT 1,
        completed_pomodoros INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        completed_at TEXT
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS pomodoro_sessions (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        session_type TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT NOT NULL,
        duration_seconds INTEGER NOT NULL,
        completed INTEGER NOT NULL
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS garden_trees (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        species TEXT NOT NULL,
        stage INTEGER NOT NULL,
        completed INTEGER NOT NULL,
        planted_at TEXT NOT NULL,
        completed_at TEXT,
        task_title TEXT,
        duration_minutes INTEGER NOT NULL
      );
    `);
  }

  // --- Tasks Persistence ---
  public async getTasks(): Promise<Task[]> {
    await this.init();
    if (this.db) {
      const rows = await this.db.select<any[]>(`SELECT * FROM tasks ORDER BY created_at DESC`);
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        estimatedPomodoros: r.estimated_pomodoros,
        completedPomodoros: r.completed_pomodoros,
        completed: Boolean(r.completed),
        createdAt: r.created_at,
        completedAt: r.completed_at || undefined,
      }));
    }

    const raw = localStorage.getItem('pomodoro_tasks');
    return raw ? JSON.parse(raw) : [];
  }

  public async saveTask(task: Task): Promise<void> {
    await this.init();
    if (this.db) {
      await this.db.execute(
        `INSERT INTO tasks (id, title, estimated_pomodoros, completed_pomodoros, completed, created_at, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           estimated_pomodoros = excluded.estimated_pomodoros,
           completed_pomodoros = excluded.completed_pomodoros,
           completed = excluded.completed,
           completed_at = excluded.completed_at`,
        [
          task.id,
          task.title,
          task.estimatedPomodoros,
          task.completedPomodoros,
          task.completed ? 1 : 0,
          task.createdAt,
          task.completedAt || null,
        ]
      );
      return;
    }

    const tasks = await this.getTasks();
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      tasks[idx] = task;
    } else {
      tasks.unshift(task);
    }
    localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
  }

  public async deleteTask(id: string): Promise<void> {
    await this.init();
    if (this.db) {
      await this.db.execute(`DELETE FROM tasks WHERE id = $1`, [id]);
      return;
    }

    const tasks = (await this.getTasks()).filter((t) => t.id !== id);
    localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
  }

  // --- Sessions Persistence ---
  public async getSessions(): Promise<PomodoroSession[]> {
    await this.init();
    if (this.db) {
      const rows = await this.db.select<any[]>(
        `SELECT s.*, t.title as task_title 
         FROM pomodoro_sessions s 
         LEFT JOIN tasks t ON s.task_id = t.id 
         ORDER BY s.started_at DESC`
      );
      return rows.map((r) => ({
        id: r.id,
        taskId: r.task_id,
        taskTitle: r.task_title || undefined,
        sessionType: r.session_type,
        startedAt: r.started_at,
        endedAt: r.ended_at,
        durationSeconds: r.duration_seconds,
        completed: Boolean(r.completed),
      }));
    }

    const raw = localStorage.getItem('pomodoro_sessions');
    return raw ? JSON.parse(raw) : [];
  }

  public async saveSession(session: PomodoroSession): Promise<void> {
    await this.init();
    if (this.db) {
      await this.db.execute(
        `INSERT INTO pomodoro_sessions (id, task_id, session_type, started_at, ended_at, duration_seconds, completed)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          session.id,
          session.taskId,
          session.sessionType,
          session.startedAt,
          session.endedAt,
          session.durationSeconds,
          session.completed ? 1 : 0,
        ]
      );
      return;
    }

    const sessions = await this.getSessions();
    sessions.unshift(session);
    localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions));
  }

  // --- Settings Persistence ---
  public async getSettings(): Promise<Partial<AppSettings>> {
    await this.init();
    if (this.db) {
      const rows = await this.db.select<any[]>(`SELECT key, value FROM settings`);
      const result: any = {};
      for (const row of rows) {
        try {
          result[row.key] = JSON.parse(row.value);
        } catch {
          result[row.key] = row.value;
        }
      }
      return result;
    }

    const raw = localStorage.getItem('pomodoro_settings');
    return raw ? JSON.parse(raw) : {};
  }

  public async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    await this.init();
    if (this.db) {
      for (const [key, value] of Object.entries(settings)) {
        await this.db.execute(
          `INSERT INTO settings (key, value) VALUES ($1, $2)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
          [key, JSON.stringify(value)]
        );
      }
      return;
    }

    const current = await this.getSettings();
    const merged = { ...current, ...settings };
    localStorage.setItem('pomodoro_settings', JSON.stringify(merged));
  }

  // --- Garden Trees Persistence ---
  public async getGardenTrees(): Promise<GardenTree[]> {
    await this.init();
    if (this.db) {
      const rows = await this.db.select<any[]>(
        `SELECT * FROM garden_trees ORDER BY planted_at DESC`
      );
      return rows.map((r) => ({
        id: r.id,
        sessionId: r.session_id,
        species: r.species as TreeSpecies,
        stage: r.stage as TreeStage,
        completed: Boolean(r.completed),
        plantedAt: r.planted_at,
        completedAt: r.completed_at || '',
        taskTitle: r.task_title || undefined,
        durationMinutes: r.duration_minutes,
      }));
    }

    const raw = localStorage.getItem('pomodoro_garden_trees');
    return raw ? JSON.parse(raw) : [];
  }

  public async saveGardenTree(tree: GardenTree): Promise<void> {
    await this.init();
    if (this.db) {
      await this.db.execute(
        `INSERT INTO garden_trees (id, session_id, species, stage, completed, planted_at, completed_at, task_title, duration_minutes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT(id) DO UPDATE SET
           species = excluded.species,
           stage = excluded.stage,
           completed = excluded.completed,
           completed_at = excluded.completed_at,
           task_title = excluded.task_title,
           duration_minutes = excluded.duration_minutes`,
        [
          tree.id,
          tree.sessionId,
          tree.species,
          tree.stage,
          tree.completed ? 1 : 0,
          tree.plantedAt,
          tree.completedAt,
          tree.taskTitle || null,
          tree.durationMinutes,
        ]
      );
      return;
    }

    const trees = await this.getGardenTrees();
    const idx = trees.findIndex((t) => t.id === tree.id);
    if (idx >= 0) {
      trees[idx] = tree;
    } else {
      trees.unshift(tree);
    }
    localStorage.setItem('pomodoro_garden_trees', JSON.stringify(trees));
  }

  private initLocalStorageFallback(): void {
    // Ensure initial storage exists
    if (!localStorage.getItem('pomodoro_tasks')) {
      localStorage.setItem('pomodoro_tasks', JSON.stringify([]));
    }
    if (!localStorage.getItem('pomodoro_sessions')) {
      localStorage.setItem('pomodoro_sessions', JSON.stringify([]));
    }
    if (!localStorage.getItem('pomodoro_garden_trees')) {
      localStorage.setItem('pomodoro_garden_trees', JSON.stringify([]));
    }
  }
}

export const databaseService = DatabaseService.getInstance();
