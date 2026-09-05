use tauri::Manager;

mod tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            // Set up System Tray
            if let Err(e) = tray::create_tray(app.handle()) {
                eprintln!("Failed to initialize system tray: {:?}", e);
            }

            // Disable rectangular window shadow on floating mini window
            if let Some(mini) = app.get_webview_window("mini") {
                let _ = mini.set_shadow(false);
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running pomodoro application");
}
