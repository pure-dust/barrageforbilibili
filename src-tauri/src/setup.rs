use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

pub static mut LOCK: bool = false;

pub fn menu() -> SystemTray {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("lock".to_string(), "锁定"))
        .add_item(CustomMenuItem::new("config".to_string(), "设置"))
        .add_item(CustomMenuItem::new("quit".to_string(), "退出"));

    SystemTray::new().with_menu(tray_menu)
}

pub fn handler(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
            let handle = app.tray_handle().get_item(&id);
            let window = app.get_window("main").unwrap();
            match id.as_str() {
                "quit" => std::process::exit(0),
                "lock" => unsafe {
                    LOCK = !LOCK;
                    if LOCK {
                        handle.set_title("解锁").unwrap();
                        window.set_skip_taskbar(true).unwrap();
                    } else {
                        handle.set_title("锁定").unwrap();
                        window.set_skip_taskbar(false).unwrap();
                    };
                    app.emit_all("lock", LOCK).unwrap()
                },
                "config" => app.emit_all("config", ()).unwrap(),
                _ => {}
            }
        }
        _ => {}
    }
}
