use crate::brain;
use serde_json::Value;

#[tauri::command]
pub fn get_state() -> Result<Value, String> {
    let state_path = brain::bizbrain_dir().join("wizard").join("state.json");

    if !state_path.exists() {
        return Ok(serde_json::json!({
            "phase": "init",
            "modules": {},
            "completedModules": [],
            "currentModule": null
        }));
    }

    let content = std::fs::read_to_string(&state_path)
        .map_err(|e| format!("Failed to read state: {}", e))?;

    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse state: {}", e))
}
