import { isEmpty } from "lodash"

export function is_empty(obj: object) {
  return isEmpty(obj)
}

export function format(date: Date | number, fmt = "yyyy-MM-dd") {
  if (typeof date === "number") date = new Date(date)
  if (!date) {
    date = new Date()
  }
  let o: { [key: string]: string | number } = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  }
  if (/(y+)/.test(fmt)) {
    let match = fmt.match(/(y+)/)
    fmt = fmt.replace(match![0], (date.getFullYear() + "").substring(4 - match![0].length))
  }
  for (let k in o) {
    let match = fmt.match(new RegExp("(" + k + ")"))
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        match![0],
        match!.length == 1 ? (o[k] as string) : ("00" + o[k]).substring(("" + o[k]).length),
      )
    }
  }
  return fmt
}

export function to_color_hex(color: string | number): string {
  if (!color) {
    return color as string
  }
  let hex = (+color).toString(16)
  while (hex.length < 6) {
    hex = "0" + hex
  }
  return "#" + hex
}
