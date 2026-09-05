use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    let title_item = MenuItem::with_id(app, "status", "🌳 Pomodoro — 25:00", false, None::<&str>)?;
    let open_item = MenuItem::with_id(app, "open", "Open Pomodoro", true, None::<&str>)?;
    let toggle_timer = MenuItem::with_id(app, "toggle-timer", "Pause / Resume", true, None::<&str>)?;
    let skip_item = MenuItem::with_id(app, "skip", "Skip Session", true, None::<&str>)?;
    let toggle_mini = MenuItem::with_id(app, "toggle-mini", "Toggle Mini Timer", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &title_item,
            &separator,
            &open_item,
            &toggle_timer,
            &skip_item,
            &toggle_mini,
            &separator,
            &quit_item,
        ],
    )?;

    let _tray = TrayIconBuilder::with_id("pomodoro-tray")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .tooltip("Pomodoro Desktop")
        .on_menu_event(move |app, event| {
            match event.id.as_ref() {
                "open" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                }
                "toggle-timer" => {
                    // Send action to Vue frontend timer store
                    let _ = app.emit("pomodoro://timer-action", serde_json::json!({ "action": "resume" }));
                }
                "skip" => {
                    let _ = app.emit("pomodoro://timer-action", serde_json::json!({ "action": "skip" }));
                }
                "toggle-mini" => {
                    if let Some(mini) = app.get_webview_window("mini") {
                        let is_visible = mini.is_visible().unwrap_or(false);
                        if is_visible {
                            let _ = mini.hide();
                        } else {
                            let _ = mini.show();
                            let _ = mini.set_always_on_top(true);
                        }
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.unminimize();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}
