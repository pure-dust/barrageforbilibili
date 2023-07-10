import { invoke } from "@tauri-apps/api"
import get_wbi_key from "../utils/wpi"

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

export async function get_wbi_keys() {
  const resp = await invoke<{
    data: {
      wbi_img: { img_url: string; sub_url: string }
    }
  }>("request", {
    method: "GET",
    url: "https://api.bilibili.com/x/web-interface/nav",
    params: {},
  })

  const img_url = resp.data.wbi_img.img_url
  const sub_url = resp.data.wbi_img.sub_url
  return {
    img_key: img_url.substring(img_url.lastIndexOf("/") + 1, img_url.length).split(".")[0],
    sub_key: sub_url.substring(sub_url.lastIndexOf("/") + 1, sub_url.length).split(".")[0],
  }
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
    url: "https://api.bilibili.com/x/web-interface/card",
    params: { mid, photo: false },
    headers,
  })
  return data.data.card.face
}
