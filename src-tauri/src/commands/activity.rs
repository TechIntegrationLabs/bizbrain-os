use crate::brain;
use serde::Serialize;
use std::fs;

#[derive(Serialize)]
pub struct ActivityFile {
    pub name: String,
    pub path: String,
    pub modified: f64,
    pub size: u64,
}

#[tauri::command]
pub fn get_recent_activity() -> Result<Vec<ActivityFile>, String> {
    let brain = brain::get_brain_path();
    let mut files = Vec::new();

    scan_dir(brain, brain, 0, 2, &mut files);

    // Sort by modified descending
    files.sort_by(|a, b| b.modified.partial_cmp(&a.modified).unwrap_or(std::cmp::Ordering::Equal));

    // Return top 20
    files.truncate(20);
    Ok(files)
}

fn scan_dir(
    root: &std::path::Path,
    dir: &std::path::Path,
    depth: usize,
    max_depth: usize,
    files: &mut Vec<ActivityFile>,
) {
    if depth > max_depth || !dir.exists() {
        return;
    }

    let entries = match fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return,
    };

    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') || name == "node_modules" {
            continue;
        }

        let path = entry.path();
        if let Ok(meta) = entry.metadata() {
            if meta.is_file() {
                let relative = path
                    .strip_prefix(root)
                    .map(|p| format!("/{}", p.to_string_lossy().replace('\\', "/")))
                    .unwrap_or_default();

                let modified = meta
                    .modified()
                    .ok()
                    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                    .map(|d| d.as_millis() as f64)
                    .unwrap_or(0.0);

                files.push(ActivityFile {
                    name,
                    path: relative,
                    modified,
                    size: meta.len(),
                });
            } else if meta.is_dir() {
                scan_dir(root, &path, depth + 1, max_depth, files);
            }
        }
    }
}
