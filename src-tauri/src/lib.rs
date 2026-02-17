mod brain;
mod commands;
mod watcher;

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WindowEvent,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }))
        .setup(|app| {
            // System tray
            let show = MenuItem::with_id(app, "show", "Show BizBrain OS", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;

            TrayIconBuilder::new()
                .menu(&menu)
                .tooltip("BizBrain OS")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            // Start file watcher for state.json → emits "state-changed" events
            watcher::start_state_watcher(app.handle().clone());

            Ok(())
        })
        .on_window_event(|window, event| {
            // Minimize to tray instead of quitting when window is closed
            if let WindowEvent::CloseRequested { api, .. } = event {
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::config::get_config,
            commands::state::get_state,
            commands::modules::get_modules,
            commands::health::get_health,
            commands::subprocess::launch_terminal,
            commands::subprocess::launch_module,
            commands::subprocess::open_brain_folder,
            commands::voice::write_voice_buffer,
            commands::activity::get_recent_activity,
        ])
        .run(tauri::generate_context!())
        .expect("error while running BizBrain OS");
}
