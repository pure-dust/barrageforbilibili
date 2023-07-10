import { invoke } from "@tauri-apps/api"

let cookie = ""

function dynamic_address() {
  return `${Math.round(Math.random() * 255)}.${Math.round(Math.random() * 255)}.${Math.round(
    Math.random() * 255,
  )}.${Math.round(Math.random() * 255)}`
}

function choose_user_agent() {
  const list = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
  ]
  return list[Math.floor(Math.random() * list.length)]
}

function headers(extra?: Record<string, string>) {
  const address = dynamic_address()
  return {
    Accept: "*/*",
    "User-Agent": choose_user_agent(),
    "Accept-Encoding": "utf-8",
    "Accept-Language": "zh-CN,zh;q=0.8",
    "Content-Type": "application/json;charset=UTF-8",
    "X-Real-IP": address,
    "X-Forwarded-For": address,
    referer: "https://www.bilibili.com/",
    cookie: cookie,
    ...(extra || {}),
  }
}

export function set_cookie(cookie: string) {
  cookie = cookie
}

export async function generate_qrcode() {
  return (
    await invoke<{
      data: {
        qrcode_key: string
        url: string
      }
    }>("request", {
      method: "GET",
      url: "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
      params: {},
      headers: headers(),
    })
  ).data
}

export async function poll_qrcode(qrcode_key: string) {
  return (
    await invoke<{
      data: {
        code: number
        message: string
        refresh_token: string
        timestamp: number
        url: string
      }
    }>("request", {
      method: "GET",
      url: "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
      params: { qrcode_key },
      headers: headers(),
    })
  ).data
}

export async function get_room_info(room_id: number) {
  return (
    await invoke<{
      data: {
        room_id: number
      }
    }>("request", {
      method: "GET",
      url: "https://api.live.bilibili.com/room/v1/Room/get_info",
      params: { room_id },
      headers: headers(),
    })
  ).data
}

export async function get_gift_config(room_id: number) {
  return (
    await invoke<{
      data: {
        list: Array<{
          id: number
          webp: string
        }>
      }
    }>("request", {
      method: "GET",
      url: "https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig",
      params: { room_id, platform: "pc" },
      headers: headers(),
    })
  ).data
}

export async function get_user_info(mid: number) {
  const data = await invoke<{
    data: {
      card: {
        face: string
      }
    }
  }>("request", {
    method: "GET",
    url: `https://api.bilibili.com/x/web-interface/card`,
    params: { mid, photo: false },
    headers: headers({
      Origin: "https://space.bilibili.com",
      Referer: `https://space.bilibili.com/${mid}/`,
    }),
  })
  return data.data.card.face
}
