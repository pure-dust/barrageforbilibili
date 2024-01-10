import { util } from "protobufjs";
import { Buffer } from "buffer";

function a(t: Buf, e?: any) {
    return ""
}

function p(t: Uint8Array, pos: number) {
    return (t[pos - 4] | t[pos - 3] << 8 | t[pos - 2] << 16 | t[pos - 1] << 24) >>> 0
}

export class Buf {
    buf: Buffer;
    pos: number;
    len: number;

    static create = function (buf: Buffer) {
        return Buffer.isBuffer(buf) ? new SubBuf(buf) : new Buf(buf)
    };

    constructor(buf: Buffer) {
        this.buf = buf,
            this.pos = 0,
            this.len = buf.length
    }

    _slice = util.Array.prototype.subarray || util.Array.prototype.slice

    uint32() {
        let c = 4294967295
        if (c = (127 & this.buf[this.pos]) >>> 0,
            this.buf[this.pos++] < 128)
            return c;
        if (c = (c | (127 & this.buf[this.pos]) << 7) >>> 0,
            this.buf[this.pos++] < 128)
            return c;
        if (c = (c | (127 & this.buf[this.pos]) << 14) >>> 0,
            this.buf[this.pos++] < 128)
            return c;
        if (c = (c | (127 & this.buf[this.pos]) << 21) >>> 0,
            this.buf[this.pos++] < 128)
            return c;
        if (c = (c | (15 & this.buf[this.pos]) << 28) >>> 0,
            this.buf[this.pos++] < 128)
            return c;
        if ((this.pos += 5) > this.len)
            throw this.pos = this.len,
            a(this, 10);
        return c
    }

    int32() {
        return 0 | this.uint32()
    }

    sint32() {
        var t = this.uint32();
        return t >>> 1 ^ -(1 & t) | 0
    }

    bool() {
        return 0 !== this.uint32()
    }

    fixed32() {
        if (this.pos + 4 > this.len)
            throw a(this, 4);
        return p(this.buf, this.pos += 4)
    }

    sfixed32() {
        if (this.pos + 4 > this.len)
            throw a(this, 4);
        return 0 | p(this.buf, this.pos += 4)
    }

    float() {
        if (this.pos + 4 > this.len)
            throw a(this, 4);
        var t = util.float.readFloatLE(this.buf, this.pos);
        return this.pos += 4,
            t
    }

    double() {
        if (this.pos + 8 > this.len)
            throw a(this, 4);
        var t = util.float.readDoubleLE(this.buf, this.pos);
        return this.pos += 8,
            t
    }

    bytes() {
        var t = this.uint32()
            , e = this.pos
            , n = this.pos + t;
        if (n > this.len)
            throw a(this, t);
        return this.pos += t,
            Array.isArray(this.buf) ? this.buf.subarray(e, n) : e === n ? Buffer.alloc(0) : this._slice.call(this.buf, e, n)
    }

    string(): string {
        var t = this.bytes();
        return util.utf8.read(t, 0, t.length)
    }

    skip(t?: number) {
        if ("number" == typeof t) {
            if (this.pos + t > this.len)
                throw a(this, t);
            this.pos += t
        } else
            do {
                if (this.pos >= this.len)
                    throw a(this)
            } while (128 & this.buf[this.pos++]);
        return this
    }

    skipType(t: number) {
        switch (t) {
            case 0:
                this.skip();
                break;
            case 1:
                this.skip(8);
                break;
            case 2:
                this.skip(this.uint32());
                break;
            case 3:
                for (; 4 != (t = 7 & this.uint32());)
                    this.skipType(t);
                break;
            case 5:
                this.skip(4);
                break;
            default:

            // throw Error("invalid wire type " + t + " at offset " + this.pos)
        }
        return this
    }

    int64() {
        return this.h().toLong(!1)
    }

    uint64() {
        return this.h().toLong(!0)
    }

    sint64() {
        return this.h().zzDecode().toLong(!1)
    }

    fixed64() {
        return this.d().toLong(!0)
    }

    sfixed64() {
        return this.d().toLong(!1)
    }

    h() {
        var t = new util.LongBits(0, 0)
            , e = 0;
        if (!(this.len - this.pos > 4)) {
            for (; e < 3; ++e) {
                if (this.pos >= this.len)
                    throw a(this);
                if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 7 * e) >>> 0,
                    this.buf[this.pos++] < 128)
                    return t
            }
            return t.lo = (t.lo | (127 & this.buf[this.pos++]) << 7 * e) >>> 0,
                t
        }
        for (; e < 4; ++e)
            if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 7 * e) >>> 0,
                this.buf[this.pos++] < 128)
                return t;
        if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 28) >>> 0,
            t.hi = (t.hi | (127 & this.buf[this.pos]) >> 4) >>> 0,
            this.buf[this.pos++] < 128)
            return t;
        if (e = 0,
            this.len - this.pos > 4) {
            for (; e < 5; ++e)
                if (t.hi = (t.hi | (127 & this.buf[this.pos]) << 7 * e + 3) >>> 0,
                    this.buf[this.pos++] < 128)
                    return t
        } else
            for (; e < 5; ++e) {
                if (this.pos >= this.len)
                    throw a(this);
                if (t.hi = (t.hi | (127 & this.buf[this.pos]) << 7 * e + 3) >>> 0,
                    this.buf[this.pos++] < 128)
                    return t
            }
        throw Error("invalid varint encoding")
    }

    d() {
        if (this.pos + 8 > this.len)
            throw a(this, 8);
        return new util.LongBits(p(this.buf, this.pos += 4), p(this.buf, this.pos += 4))
    }
}

class SubBuf extends Buf {
    constructor(buf: Buffer) {
        super(buf)
    }

    _slice = util.Buffer.prototype.slice;

    string() {
        let t = this.uint32()
        return this.buf.subarray ? this.buf.subarray(this.pos, Math.min(this.pos + t, this.pos = Math.min(this.pos + t, this.len))).toString() : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + t, this.len))
    }

}







