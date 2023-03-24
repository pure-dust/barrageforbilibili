import { invoke } from "@tauri-apps/api"

const headers = {
  Accept: "*/*",
  "Accept-Encoding": "utf-8", //这里设置返回的编码方式 设置其他的会是乱码
  "Accept-Language": "zh-CN,zh;q=0.8",
  "Content-Type": "application/json;charset=UTF-8",
  referer: "https://www.bilibili.com/",
  cookie: "",
}

export function set_cookie(cookie: string) {
  headers.cookie = cookie
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
      headers,
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
      headers,
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
      headers,
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
      headers,
    })
  ).data
}
