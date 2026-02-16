use std::path::PathBuf;
use std::sync::OnceLock;

static BRAIN_PATH: OnceLock<PathBuf> = OnceLock::new();

/// Resolve and cache the brain root directory.
/// Priority: BIZBRAIN_PATH env → ~/bizbrain-os
pub fn get_brain_path() -> &'static PathBuf {
    BRAIN_PATH.get_or_init(|| {
        // 1. Environment variable
        if let Ok(p) = std::env::var("BIZBRAIN_PATH") {
            let pb = PathBuf::from(p);
            if pb.exists() {
                return pb;
            }
        }

        // 2. Default: home/bizbrain-os
        if let Ok(home) = std::env::var("USERPROFILE")
            .or_else(|_| std::env::var("HOME"))
        {
            let default = PathBuf::from(&home).join("bizbrain-os");
            if default.exists() {
                return default;
            }

            // 3. Check Repos subdirectory (common dev setup)
            let repos = PathBuf::from(&home).join("Repos").join("bizbrain-os");
            if repos.exists() {
                return repos;
            }
        }

        // 4. Fallback: current working directory
        std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
    })
}

/// Get the .bizbrain directory path
pub fn bizbrain_dir() -> PathBuf {
    get_brain_path().join(".bizbrain")
}
