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
            match id.as_str() {
                "quit" => std::process::exit(0),
                "lock" => unsafe {
                    LOCK = !LOCK;
                    if LOCK {
                        handle.set_title("解锁").unwrap();
                    } else {
                        handle.set_title("锁定").unwrap();
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
