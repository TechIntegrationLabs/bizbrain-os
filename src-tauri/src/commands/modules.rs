use crate::brain;
use serde_json::Value;
use std::fs;

#[tauri::command]
pub fn get_modules() -> Result<Vec<Value>, String> {
    let bizbrain = brain::bizbrain_dir();
    let mut modules = Vec::new();

    let dirs = [
        (bizbrain.join("modules"), false),
        (bizbrain.join("modules").join("_core"), true),
    ];

    for (dir, is_core) in &dirs {
        if !dir.exists() {
            continue;
        }
        let entries = fs::read_dir(dir)
            .map_err(|e| format!("Failed to read modules dir: {}", e))?;

        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            if !name.ends_with(".json") {
                continue;
            }
            let content = match fs::read_to_string(entry.path()) {
                Ok(c) => c,
                Err(_) => continue,
            };
            let mut data: Value = match serde_json::from_str(&content) {
                Ok(d) => d,
                Err(_) => continue,
            };

            // Inject metadata
            if let Some(obj) = data.as_object_mut() {
                obj.insert("_file".to_string(), Value::String(name));
                obj.insert("_core".to_string(), Value::Bool(*is_core));
            }

            modules.push(data);
        }
    }

    Ok(modules)
}
