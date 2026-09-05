# 🌳 Pomodoro Desktop

A calm, beautiful, local-first Pomodoro desktop application featuring a **floating focus companion** and a **gamified growing tree garden**. Built with **Tauri v2**, **Vue 3**, **TypeScript**, and **SQLite**.

---

## 📥 Download & Install

Download the latest version for your platform:

| Platform | Installer | Architecture |
| :--- | :--- | :--- |
| **macOS** (Apple Silicon) | [**Download .DMG (v1.0.0)**](https://github.com/Shielamaebig/Pomodoro/releases/download/v1.0.0/Pomodoro_1.0.0_aarch64.dmg) | `aarch64` (M1 / M2 / M3 / M4) |
| **All Releases** | [**View GitHub Releases**](https://github.com/Shielamaebig/Pomodoro/releases/latest) | macOS / Windows |

### macOS Installation:
1. Download **[`Pomodoro_1.0.0_aarch64.dmg`](https://github.com/Shielamaebig/Pomodoro/releases/download/v1.0.0/Pomodoro_1.0.0_aarch64.dmg)**.
2. Double-click the `.dmg` file.
3. Drag **Pomodoro** into your **Applications** folder.
4. Launch Pomodoro from your Applications folder or Spotlight (`Cmd + Space`).

---

## ✨ Features

- **🌱 Gamified Growing Tree**:
  - Watch your tree grow from a tiny dormant seed into a flourishing mature tree as your focus session advances.
  - 5 handcrafted illustrated species: *Mighty Oak*, *Alpine Pine*, *Sakura Cherry Blossom*, *Golden Maple*, and *Blooming Magnolia*.
  - Every completed session plants a tree in your **Focus Garden**.

- **🪟 Floating Focus Companion**:
  - Automatically pops out and minimizes the main app when you start a focus session.
  - Hover reveals quick controls: `↻` (Reset), `⏸ / ▶` (Pause / Resume), and `⏭` (Skip).
  - **Two Display Modes**: Switch between the expanded focus card and a minimalist compact ribbon pill (`⤢`).
  - **Quick Desktop Return**: Click `🗔` anytime to unminimize and return to the main desktop window.
  - Remembers its screen position across restarts.

- **📋 Task & Session Management**:
  - Create and organize tasks with estimated Pomodoro tree counts.
  - Link any active task directly to your current focus session.
  - Filter tasks by active or completed status.

- **📊 Statistics & Productivity History**:
  - Daily, weekly, and monthly productivity summaries.
  - Visual weekly focus hour bar charts.
  - Current and longest daily streak tracking.
  - Full chronological session history timeline.

- **🔒 Local-First & Privacy Focused**:
  - All data is saved locally on your device in an encrypted/embedded SQLite database.
  - No account or internet connection required.

---

## 🛠️ Tech Stack

- **Framework**: [Tauri v2](https://v2.tauri.app/) (Rust backend)
- **Frontend**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Database**: SQLite ([tauri-plugin-sql](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/sql))
- **Icons**: [Lucide Vue Next](https://lucide.dev/) + Custom Vector SVGs

---

## 💻 Development Setup

### Prerequisites:
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (latest stable)

### Clone & Install:
```bash
git clone https://github.com/Shielamaebig/Pomodoro.git
cd Pomodoro
npm install
```

### Run Locally (Dev Mode):
```bash
npm run tauri dev
```

### Build Production Release:
```bash
npm run tauri build
```
The compiled installer will be available in:
- macOS: `src-tauri/target/release/bundle/dmg/`
- Windows: `src-tauri/target/release/bundle/msi/`

