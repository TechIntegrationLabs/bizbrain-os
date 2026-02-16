use crate::brain;
use serde_json::Value;

#[tauri::command]
pub fn get_config() -> Result<Value, String> {
    let brain = brain::get_brain_path();

    // Try config.json first, fall back to config.template.json
    let config_path = brain.join("config.json");
    let template_path = brain.join("config.template.json");

    let path = if config_path.exists() {
        config_path
    } else if template_path.exists() {
        template_path
    } else {
        return Ok(serde_json::json!({}));
    };

    let content = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read config: {}", e))?;

    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse config: {}", e))
}
