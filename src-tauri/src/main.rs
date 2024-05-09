// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn exporter(outputFile: &str) -> String {
    
   let importerScript = Command::new("node")
        .arg("../src/scripts/exporter.mjs")
        .arg(outputFile)
        .output()
        .expect("Failed to execute command");

    print!("status: {}", importerScript.status);
    print!("stdout: {}", String::from_utf8_lossy(&importerScript.stdout));
    print!("stderr: {}", String::from_utf8_lossy(&importerScript.stderr));

    return String::from_utf8_lossy(&importerScript.stdout).to_string();
}
#[tauri::command]
fn importer(inputFile: &str) -> String {
    let importerScript = Command::new("node")
        .arg("../src/scripts/importer.mjs")
        .arg(inputFile)
        .output()
        .expect("Failed to execute command");

    print!("status: {}", importerScript.status);
    print!("stdout: {}", String::from_utf8_lossy(&importerScript.stdout));
    print!("stderr: {}", String::from_utf8_lossy(&importerScript.stderr));

    return String::from_utf8_lossy(&importerScript.stdout).to_string();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![exporter, importer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
