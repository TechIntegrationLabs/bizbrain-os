use crate::brain;
use std::fs;

#[tauri::command]
pub fn write_voice_buffer(text: String) -> Result<serde_json::Value, String> {
    if text.is_empty() {
        return Err("text required".to_string());
    }

    let buffer_path = brain::bizbrain_dir().join("wizard").join("voice-buffer.txt");

    // Ensure directory exists
    if let Some(parent) = buffer_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let entry = format!("[{}] {}\n", chrono::Utc::now().to_rfc3339(), text);

    use std::io::Write;
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&buffer_path)
        .map_err(|e| format!("Failed to open voice buffer: {}", e))?;

    file.write_all(entry.as_bytes())
        .map_err(|e| format!("Failed to write voice buffer: {}", e))?;

    Ok(serde_json::json!({ "ok": true }))
}
