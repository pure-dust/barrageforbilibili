import { writeFile, BaseDirectory, createDir, exists } from "@tauri-apps/api/fs"
import default_setting from "../assets/static/default_setting"

export async function init_setting() {
  let is_exist = await exists("", {
    dir: BaseDirectory.AppConfig,
  })

  if (!is_exist) {
    await createDir("barrageforbilibili", {
      dir: BaseDirectory.Config,
    })
  }

  is_exist = await exists("app.json", {
    dir: BaseDirectory.AppConfig,
  })

  if (!is_exist) {
    await writeFile("app.json", JSON.stringify(default_setting, undefined, 2), {
      dir: BaseDirectory.AppConfig,
    })
  }
}
