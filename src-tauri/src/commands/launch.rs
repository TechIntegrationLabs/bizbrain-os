use crate::brain;
use serde_json::Value;
use std::fs;

#[tauri::command]
pub fn get_launch_state() -> Result<Value, String> {
    let path = brain::bizbrain_dir().join("launch-state.json");

    if !path.exists() {
        return Ok(serde_json::json!({
            "checklist": {},
            "launchDate": null,
            "posts": {}
        }));
    }

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read launch state: {}", e))?;

    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse launch state: {}", e))
}

#[tauri::command]
pub fn save_launch_state(data: Value) -> Result<Value, String> {
    let path = brain::bizbrain_dir().join("launch-state.json");

    // Ensure parent dir exists
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let content = serde_json::to_string_pretty(&data)
        .map_err(|e| format!("Failed to serialize: {}", e))?;

    fs::write(&path, content)
        .map_err(|e| format!("Failed to write launch state: {}", e))?;

    Ok(serde_json::json!({ "ok": true }))
}
