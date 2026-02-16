use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::sync::mpsc;
use tauri::Emitter;

/// Watch .bizbrain/wizard/state.json and emit "state-changed" events to the frontend
/// whenever the file is modified.
pub fn start_state_watcher(app_handle: tauri::AppHandle) {
    let brain = crate::brain::get_brain_path().clone();
    let wizard_dir = brain.join(".bizbrain").join("wizard");

    // Only start watching if the directory exists
    if !wizard_dir.exists() {
        eprintln!("[watcher] Wizard directory not found: {:?}", wizard_dir);
        return;
    }

    std::thread::spawn(move || {
        let (tx, rx) = mpsc::channel::<notify::Result<Event>>();

        let mut watcher = match RecommendedWatcher::new(tx, Config::default()) {
            Ok(w) => w,
            Err(e) => {
                eprintln!("[watcher] Failed to create watcher: {}", e);
                return;
            }
        };

        if let Err(e) = watcher.watch(&wizard_dir, RecursiveMode::NonRecursive) {
            eprintln!("[watcher] Failed to watch directory: {}", e);
            return;
        }

        println!("[watcher] Watching {:?} for state changes", wizard_dir);

        for event in rx {
            match event {
                Ok(Event {
                    kind: EventKind::Modify(_) | EventKind::Create(_),
                    paths,
                    ..
                }) => {
                    let is_state = paths.iter().any(|p| {
                        p.file_name()
                            .map(|n| n == "state.json")
                            .unwrap_or(false)
                    });

                    if is_state {
                        let state_path = wizard_dir.join("state.json");
                        if let Ok(content) = std::fs::read_to_string(&state_path) {
                            if let Ok(data) = serde_json::from_str::<serde_json::Value>(&content) {
                                let _ = app_handle.emit("state-changed", data);
                            }
                        }
                    }
                }
                Err(e) => {
                    eprintln!("[watcher] Error: {}", e);
                }
                _ => {}
            }
        }
    });
}
