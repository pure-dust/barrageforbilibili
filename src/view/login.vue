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
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .qrcode {
    margin-bottom: 48px;
  }

  .room-id {
    appearance: none;
    outline: none;
    border: none;
    padding: 4px 8px;
    background-color: rgba(67, 67, 67, 0.5);
    border-radius: 1px;
    transition: 0.2s;
    width: 120px;
    margin-bottom: 12px;
    color: #fff;
    text-align: center;

    &:focus {
      box-shadow: 0 0 10px 2px rgba(112, 112, 112, 0.3);
    }
  }

  .enter-btn {
    appearance: none;
    border: none;
    width: 120px;
    padding: 4px 8px;
    background: #0f7fce;
    color: #fff;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px 2px rgba(20, 124, 227, 0.525);
    }

    &:active {
      box-shadow: 0 0 10px 2px rgba(112, 112, 112, 0.3);
    }
  }
}
</style>
