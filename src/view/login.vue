<template>
  <div :class="['login', { locked: lock }]">
    <img class="qrcode" v-show="state.base64" :src="state.base64" alt="scan" />
    <input class="room-id" type="text" v-model="state.room_id" />
    <button class="enter-btn" @click="on_ensure">确认</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue"
import QRCode from "qrcode"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"

import { generate_qrcode, poll_qrcode, set_cookie } from "../api/index"
import { useGlobal } from "../store"

const { lock } = storeToRefs(useGlobal())
const router = useRouter()
const state = reactive({
  room_id: "",
  base64: "",
})

const qrcode = async () => {
  const { url, qrcode_key } = await generate_qrcode()

  let opts = {
    errorCorrectionLevel: "Q",
    type: "image/png",
    width: 128,
    height: 128,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  }
  // @ts-ignore
  state.base64 = await QRCode.toDataURL(url, opts)
  let tick = setInterval(async () => {
    let { code, refresh_token, message, url } = await poll_qrcode(qrcode_key)
    switch (code) {
      case 0:
        let cookie = url.match(/(?<=\?).*/)![0]
        set_cookie(cookie)
        clearInterval(tick)
        break
      case 86090:
        break
      case 86101:
        break
      case 86038:
        break
      default:
        break
    }
    console.log({ refresh_token, message, url })
  }, 5000)
}

const on_ensure = () => {
  if (state.room_id) {
    router.push({
      name: "main",
      params: {
        id: state.room_id,
      },
    })
  } else {
  }
}

onMounted(async () => {
  // qrcode()
})
</script>
<style lang="less">

</style>
