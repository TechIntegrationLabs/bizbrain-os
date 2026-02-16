use serde::Serialize;
use std::process::Command;

#[derive(Serialize)]
pub struct HealthInfo {
    pub claude: bool,
    #[serde(rename = "claudeVersion")]
    pub claude_version: Option<String>,
    pub node: bool,
    #[serde(rename = "nodeVersion")]
    pub node_version: Option<String>,
    pub git: bool,
    #[serde(rename = "gitVersion")]
    pub git_version: Option<String>,
    pub platform: String,
    pub arch: String,
    pub uptime: u64,
    #[serde(rename = "freeMemory")]
    pub free_memory: u64,
}

fn check_command(cmd: &str) -> Option<String> {
    Command::new(cmd)
        .arg("--version")
        .output()
        .ok()
        .and_then(|o| {
            if o.status.success() {
                Some(String::from_utf8_lossy(&o.stdout).trim().to_string())
            } else {
                None
            }
        })
}

#[tauri::command]
pub fn get_health() -> Result<HealthInfo, String> {
    let claude = check_command("claude");
    let node = check_command("node");
    let git = check_command("git");

    // System info
    let sys_info = sysinfo();

    Ok(HealthInfo {
        claude: claude.is_some(),
        claude_version: claude,
        node: node.is_some(),
        node_version: node,
        git: git.is_some(),
        git_version: git,
        platform: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        uptime: sys_info.0,
        free_memory: sys_info.1,
    })
}

fn sysinfo() -> (u64, u64) {
    // On Windows, use rough estimation via SystemInfo
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        let uptime = Command::new("powershell")
            .args(["-Command", "(Get-CimInstance Win32_OperatingSystem).LastBootUpTime | ForEach-Object { [int]((Get-Date) - $_).TotalSeconds }"])
            .output()
            .ok()
            .and_then(|o| String::from_utf8_lossy(&o.stdout).trim().parse::<u64>().ok())
            .unwrap_or(0);
        let free_mem = Command::new("powershell")
            .args(["-Command", "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024"])
            .output()
            .ok()
            .and_then(|o| String::from_utf8_lossy(&o.stdout).trim().parse::<u64>().ok())
            .unwrap_or(0);
        (uptime, free_mem)
    }
    #[cfg(not(target_os = "windows"))]
    {
        (0, 0)
    }
}
