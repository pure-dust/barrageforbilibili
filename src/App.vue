<template>
  <drag></drag>
  <router-view> </router-view>
</template>
<script setup lang="ts">
import { listen, emit } from "@tauri-apps/api/event"
import { appWindow } from "@tauri-apps/api/window"
import { useGlobal } from "./store"

import drag from "./view/drag.vue"
import { load_config, set_vars } from "./utils/setting"

const store = useGlobal()

const on_listen_config = async () => {
  let data = await load_config()
  emit("blur", data.apperance.blur)
  set_vars(data)
}

listen("save-config", on_listen_config)
listen("lock", (event) => {
  store.update_lock(event.payload as boolean)
  appWindow.setIgnoreCursorEvents(event.payload as boolean)
})

on_listen_config()
</script>

<style lang="less"></style>
