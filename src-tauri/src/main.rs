#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

mod setup;
mod utils;

fn main() {
    tauri::Builder::default()
        .system_tray(setup::menu())
        .on_system_tray_event(setup::handler)
        .invoke_handler(tauri::generate_handler![utils::request::request])
        .setup(|app| {
            let handler = app.tray_handle().get_item("lock");
            app.listen_global("lock", move |event| {
                unsafe {
                    setup::LOCK = event.payload().is_some();
                }
                handler
                    .set_title(match event.payload().is_some() {
                        true => "解锁",
                        false => "锁定",
                    })
                    .unwrap();
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
