use crate::brain;
#[tauri::command]
pub fn launch_terminal() -> Result<serde_json::Value, String> {
    let brain = brain::get_brain_path();
    let brain_str = brain.to_string_lossy().to_string();

    #[cfg(target_os = "windows")]
    {
        let cmd = format!(
            "start wt -d \"{}\" cmd /k claude 2>nul || start cmd /k \"cd /d \"{}\" && claude\"",
            brain_str, brain_str
        );
        std::process::Command::new("cmd")
            .args(["/C", &cmd])
            .spawn()
            .map_err(|e| format!("Failed to launch terminal: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        let script = format!(
            "tell app \"Terminal\" to do script \"cd \\\"{}\\\" && claude\"",
            brain_str
        );
        std::process::Command::new("osascript")
            .args(["-e", &script])
            .spawn()
            .map_err(|e| format!("Failed to launch terminal: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        let cmd = format!(
            "x-terminal-emulator -e \"cd '{}' && claude\" || gnome-terminal -- bash -c \"cd '{}' && claude; exec bash\"",
            brain_str, brain_str
        );
        std::process::Command::new("sh")
            .args(["-c", &cmd])
            .spawn()
            .map_err(|e| format!("Failed to launch terminal: {}", e))?;
    }

    Ok(serde_json::json!({ "ok": true }))
}

#[tauri::command]
pub fn launch_module(module: String) -> Result<serde_json::Value, String> {
    if module.is_empty() {
        return Err("module required".to_string());
    }

    let brain = brain::get_brain_path();
    let brain_str = brain.to_string_lossy().to_string();
    let prompt = format!("Run /setup-module {}", module);

    #[cfg(target_os = "windows")]
    {
        let cmd = format!(
            "start wt -d \"{}\" cmd /k claude --prompt \"{}\" 2>nul || start cmd /k \"cd /d \"{}\" && claude --prompt \"{}\"\"",
            brain_str, prompt, brain_str, prompt
        );
        std::process::Command::new("cmd")
            .args(["/C", &cmd])
            .spawn()
            .map_err(|e| format!("Failed to launch module: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        let script = format!(
            "tell app \"Terminal\" to do script \"cd \\\"{}\\\" && claude --prompt \\\"{}\\\"\"",
            brain_str, prompt
        );
        std::process::Command::new("osascript")
            .args(["-e", &script])
            .spawn()
            .map_err(|e| format!("Failed to launch module: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        let cmd = format!(
            "x-terminal-emulator -e \"cd '{}' && claude --prompt '{}'\" || gnome-terminal -- bash -c \"cd '{}' && claude --prompt '{}'; exec bash\"",
            brain_str, prompt, brain_str, prompt
        );
        std::process::Command::new("sh")
            .args(["-c", &cmd])
            .spawn()
            .map_err(|e| format!("Failed to launch module: {}", e))?;
    }

    Ok(serde_json::json!({ "ok": true, "module": module }))
}

#[tauri::command]
pub fn open_brain_folder() -> Result<serde_json::Value, String> {
    let brain = brain::get_brain_path();

    #[cfg(target_os = "windows")]
    {
        let path_str = brain.to_string_lossy().replace('/', "\\");
        std::process::Command::new("explorer")
            .arg(&path_str)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(brain.as_os_str())
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(brain.as_os_str())
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }

    Ok(serde_json::json!({ "ok": true }))
}
