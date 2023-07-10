import md5 from "md5"
import { invoke } from "@tauri-apps/api"

const headers = {
  Accept: "*/*",
  "Accept-Encoding": "utf-8", //这里设置返回的编码方式 设置其他的会是乱码
  "Accept-Language": "zh-CN,zh;q=0.8",
  "Content-Type": "application/json;charset=UTF-8",
  referer: "https://www.bilibili.com/",
  cookie: "",
}

const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28,
  14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54,
  21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
]

async function get_wbi_keys() {
  const resp = await invoke<{
    data: {
      wbi_img: { img_url: string; sub_url: string }
    }
  }>("request", {
    headers,
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

function get_mixin_key(orig: string) {
  let temp = ""
  mixinKeyEncTab.forEach((n) => {
    temp += orig[n]
  })
  return temp.slice(0, 32)
}

function enc_wbi(params: Record<string, any>, img_key: string, sub_key: string) {
  const mixin_key = get_mixin_key(img_key + sub_key),
    curr_time = Math.round(Date.now() / 1000),
    chr_filter = /[!'\(\)*]/g
  let query: string[] = []
  params = Object.assign(params, { wts: curr_time }) // 添加 wts 字段
  Object.keys(params)
    .sort()
    .forEach((key) => {
      query.push(
        encodeURIComponent(key) +
          "=" +
          encodeURIComponent(("" + params[key]).replace(chr_filter, "")),
      )
    })
  const new_query = query.join("&")
  const wbi_sign = md5(new_query + mixin_key) // 计算 w_rid
  return new_query + "&w_rid=" + wbi_sign
}

export default async function get_wbi_key() {
  const wbi_keys = await get_wbi_keys()
  return enc_wbi(
    {
      foo: "114",
      bar: "514",
      baz: 1919810,
    },
    wbi_keys.img_key,
    wbi_keys.sub_key,
  )
}
