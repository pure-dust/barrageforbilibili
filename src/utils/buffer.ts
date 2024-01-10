const WS = {
  WS_OP_HEARTBEAT: 2,
  WS_OP_HEARTBEAT_REPLY: 3,
  WS_OP_MESSAGE: 5,
  WS_OP_USER_AUTHENTICATION: 7,
  WS_OP_CONNECT_SUCCESS: 8,
  WS_PACKAGE_HEADER_TOTAL_LENGTH: 16,
  WS_PACKAGE_OFFSET: 0,
  WS_HEADER_OFFSET: 4,
  WS_VERSION_OFFSET: 6,
  WS_OPERATION_OFFSET: 8,
  WS_SEQUENCE_OFFSET: 12,
  WS_BODY_PROTOCOL_VERSION_NORMAL: 0,
  WS_BODY_PROTOCOL_VERSION_BROTLI: 3,
  WS_HEADER_DEFAULT_VERSION: 1,
  WS_HEADER_DEFAULT_OPERATION: 1,
  WS_HEADER_DEFAULT_SEQUENCE: 1,
  WS_AUTH_OK: 0,
  WS_AUTH_TOKEN_ERROR: -101
}

interface WsMessage extends Record<string, any> {
  body: any,
  packetLen: number
  headerLen: number
  ver: number
  op: number
  seq: number
}

const wsBinaryHeaderList = [
  {
    name: "Header Length",
    key: "headerLen",
    bytes: 2,
    offset: 4,
    value: 16
  },
  {
    name: "Protocol Version",
    key: "ver",
    bytes: 2,
    offset: 6,
    value: 1
  },
  {
    name: "Operation",
    key: "op",
    bytes: 4,
    offset: 8,
    value: 2
  },
  {
    name: "Sequence Id",
    key: "seq",
    bytes: 4,
    offset: 12,
    value: 1
  }
]

function getDecoder() {
  return window.TextDecoder ? new window.TextDecoder : {
    decode: function (t: any) {
      return decodeURIComponent(window.escape(String.fromCharCode.apply(String, new Uint8Array(t) as unknown as Array<number>)))
    }
  }
}

function convertToObject(buf: ArrayBuffer) {
  let e = new DataView(buf)
  let n: WsMessage = {
    body: [],
    packetLen: 0,
    headerLen: 0,
    ver: 0,
    op: 0,
    seq: 0
  };
  n.packetLen = e.getInt32(WS.WS_PACKAGE_OFFSET)
  wsBinaryHeaderList.forEach(function (t) {
    4 === t.bytes ? n[t.key] = e.getInt32(t.offset) : 2 === t.bytes && (n[t.key] = e.getInt16(t.offset))
  })
  n.packetLen < buf.byteLength && convertToObject(buf.slice(0, n.packetLen))
  let decoder = getDecoder()
  if (
    !n.op || WS.WS_OP_MESSAGE !== n.op && n.op !== WS.WS_OP_CONNECT_SUCCESS) {
    n.op && WS.WS_OP_HEARTBEAT_REPLY === n.op && (n.body = {
      count: e.getInt32(WS.WS_PACKAGE_HEADER_TOTAL_LENGTH)
    });
  }

  else
    for (let i = WS.WS_PACKAGE_OFFSET, s = n.packetLen, a = 0, u = ""; i < buf.byteLength; i += s) {
      s = e.getInt32(i),
        a = e.getInt16(i + WS.WS_HEADER_OFFSET);
      try {
        if (n.ver === WS.WS_BODY_PROTOCOL_VERSION_NORMAL) {
          let c = decoder.decode(buf.slice(i + a, i + s));
          u = 0 !== c.length ? JSON.parse(c) : null
        } else if (n.ver === WS.WS_BODY_PROTOCOL_VERSION_BROTLI) {
          let l = buf.slice(i + a, i + s)
            // @ts-ignore
            , h = window.BrotliDecode(new Uint8Array(l));
          u = convertToObject(h.buffer).body
        }
        u && n.body.push(u)
      } catch (e) {

      }
    }
  return n
}
