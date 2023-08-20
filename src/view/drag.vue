<template>
  <div :class="['drag', { locked: lock }]" data-tauri-drag-region>
    <span @click="on_back" v-if="route.name !== 'login'">
      <svg class="icon">
        <use xlink:href="#kl-back"></use>
      </svg>
    </span>
    <span style="margin: 0 4px 0 auto" @click="on_config">
      <svg class="icon">
        <use xlink:href="#kl-setting"></use>
      </svg>
    </span>
    <span @click="on_close">
      <svg class="icon">
        <use xlink:href="#kl-close"></use>
      </svg>
    </span>
  </div>
</template>
<script setup lang="ts">
import { appWindow, WebviewWindow } from "@tauri-apps/api/window"
import { listen } from "@tauri-apps/api/event"
import { useRoute, useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useGlobal } from "../store"

const route = useRoute()
const router = useRouter()
const { lock } = storeToRefs(useGlobal())

const on_back = () => {
  router.push({
    name: "login",
  })
}

const on_close = () => {
  appWindow.close()
}

const on_config = () => {
  new WebviewWindow("setting", {
    url: "/setting/index.html",
    width: 540,
    height: 480,
    center: true,
    decorations: false,
    resizable: false,
    skipTaskbar: true,
    transparent: true,
    alwaysOnTop: true,
  })
}
listen("config", () => {
  on_config()
})
</script>
<style lang="less">

</style>
