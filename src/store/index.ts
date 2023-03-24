import { defineStore } from "pinia"

export const useGlobal = defineStore("global", {
  state: () => ({
    lock: false,
  }),
  actions: {
    update_lock(lock: boolean) {
      this.lock = lock
    },
  },
})
