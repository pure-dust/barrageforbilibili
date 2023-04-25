import { readTextFile, BaseDirectory, writeFile } from "@tauri-apps/api/fs"

export async function load_config() {
  let text = await readTextFile("app.json", {
    dir: BaseDirectory.AppConfig,
  })
  return JSON.parse(text) as Setting
}

export async function save_config(config: Setting) {
  await writeFile("app.json", JSON.stringify(config, undefined, 2), {
    dir: BaseDirectory.AppConfig,
  })
}

export function set_vars(config: Setting) {
  const { danmu, gift, interact, apperance } = config
  let root = document.querySelector(":root")!

  root.setAttribute(
    "style",
    `
    --danmu-time-size: ${danmu.time_text_size}px;
    --danmu-user-size: ${danmu.user_text_size}px;
    --danmu-size: ${danmu.danmu_text_size}px;
    --danmu-hieght: ${danmu.danmu_text_size + 2}px;
    --danmu-time-color: ${danmu.time_color};
    --danmu-user-color: ${danmu.user_color};
    --danmu-color: ${danmu.danmu_color};

    --gift-user-size: ${gift.user_text_size}px;
    --gift-size: ${gift.danmu_text_size}px;
    --gift-user-color: ${gift.user_color};
    --gift-color: ${gift.danmu_color};

    --interact-user-size: ${interact.user_text_size}px;
    --interact-height: ${Math.max(interact.user_text_size, interact.danmu_text_size) + 8}px;
    --interact-size: ${interact.danmu_text_size}px;
    --interact-user-color: ${interact.user_color};
    --interact-color: ${interact.danmu_color};

    --main-background: ${apperance.transparent ? "transparent" : apperance.background};
  `,
  )
}
