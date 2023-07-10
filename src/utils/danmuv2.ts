import { Buffer } from "buffer"
import protobuf from "protobufjs"

export default function decode_danmuv2(msg: string): string {
  if (!msg) {
    return ""
  }
  let buffer = Buffer.from(msg, "base64")
  let proto = protobuf.parse(
    'syntax = "proto3";\nmessage UserInfo {\n  string face = 4;\n}\n\nmessage DanmuV2 {\n  UserInfo user = 20;\n}',
  ).root
  let danmuv2 = proto.lookupType("DanmuV2")
  let user = danmuv2.decode(buffer)
  return user.toJSON().user.face
}
