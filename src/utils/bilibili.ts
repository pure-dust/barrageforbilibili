import Long from "long";
import { util } from "protobufjs";
import { Buf } from "./Buf";

class Bubble {

  decode(buf: Buf, pos: number): null {
    return null
  }
}

class Emoticon {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

class Voice {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

class Aggregation {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

class Check {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

class User {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

class Room {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

class Icon {
  decode(buf: Buf, pos: number): null {
    return null
  }
}

export class DM {
  id_str = ""
  mode = 0
  fontsize = 0
  color = 0
  mid_hash = ""
  content = ""
  ctime = Long.fromBits(0, 0, !1)
  weight = 0
  rnd = Long.fromBits(0, 0, !1)
  attr = Long.fromBits(0, 0, !1)
  biz_scene = 0
  bubble = null
  dm_type = 0
  emoticons = util.emptyObject as Record<string, any>
  voice = null
  animation = ""
  aggregation = null
  send_from_me = !1
  check = null
  user = null
  room = null
  icon = null

  decode(buf: Uint8Array | Buf, pos?: number) {
    buf instanceof Buf || (buf = new Buf(buf as Buffer))
    let i = pos === void 0 ? buf.len : buf.pos + pos;
    let r = "", n
    for (; buf.pos < i;) {
      let a = buf.uint32();
      switch (a >>> 3) {
        case 1:
          this.id_str = buf.string();
          break;
        case 2:
          this.mode = buf.int32();
          break;
        case 3:
          this.fontsize = buf.int32();
          break;
        case 4:
          this.color = buf.uint32();
          break;
        case 5:
          this.mid_hash = buf.string();
          break;
        case 6:
          this.content = buf.string();
          break;
        case 7:
          this.ctime = buf.int64() as Long;
          break;
        case 8:
          this.weight = buf.int32();
          break;
        case 9:
          this.rnd = buf.int64() as Long;
          break;
        case 10:
          this.attr = buf.int64() as Long;
          break;
        case 11:
          this.biz_scene = buf.int32();
          break;
        case 12:
          this.bubble = new Bubble().decode(buf, buf.uint32());
          break;
        case 13:
          this.dm_type = buf.int32();
          break;
        case 14:
          this.emoticons === util.emptyObject && (this.emoticons = {});
          let c = buf.uint32() + buf.pos;
          for (; buf.pos < c;) {
            let u = buf.uint32();
            switch (u >>> 3) {
              case 1:
                r = buf.string();
                break;
              case 2:
                n = new Emoticon().decode(buf, buf.uint32());
                break;
              default:
                buf.skipType(7 & u)
            }
          }
          this.emoticons[r] = n;
          break;
        case 15:
          this.voice = new Voice().decode(buf, buf.uint32())
          break;
        case 16:
          this.animation = buf.string();
          break;
        case 17:
          this.aggregation = new Aggregation().decode(buf, buf.uint32());
          break;
        case 18:
          this.send_from_me = buf.bool();
          break;
        case 19:
          this.check = new Check().decode(buf, buf.uint32());
          break;
        case 20:
          this.user = new User().decode(buf, buf.uint32());
          break;
        case 21:
          this.room = new Room().decode(buf, buf.uint32());
          break;
        case 22:
          this.icon = new Icon().decode(buf, buf.uint32());
          break;
        default:
          buf.skipType(7 & a)
      }
    }
    return this
  }
}

