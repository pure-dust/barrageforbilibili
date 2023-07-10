import { defineStore } from "pinia"
import { get_user_info } from "../api"
import { Ref } from "vue"

export const useGlobal = defineStore("global", {
  state: () => ({
    lock: false,
    face: new Map<number, string>(),
    queue: [] as Array<Function>,
    tick: null as unknown as NodeJS.Timeout,
  }),
  actions: {
    update_lock(lock: boolean) {
      this.lock = lock
    },
    async update_face(mid: number, val: Ref) {
      if (this.face.has(mid)) {
        val.value = this.face.get(mid)
        return
      }
      const callback = async () => {
        this.face.set(mid, await get_user_info(mid))
        val.value = this.face.get(mid)!
      }
      this.queue.push(callback)

      if (!this.tick) {
        this.tick = setInterval(async () => {
          if (this.queue.length === 0) {
            clearInterval(this.tick)
            this.tick = null as unknown as NodeJS.Timeout
            return
          }
          const cb = this.queue.pop()!
          await cb()
        }, 1000)
      }
    },
  },
})
