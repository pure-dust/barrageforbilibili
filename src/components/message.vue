<template>
  <div class="message-item">
    <div v-if="show_user" class="message-user">
      <div class="face-wrapper">
        <img :src="face || 'http://i0.hdslb.com/bfs/face/member/noface.jpg'" alt="" />
      </div>
    </div>
    <div class="message-body">
      <div class="message-left">
        <span v-if="show_time" class="message-time">{{ format(message.timestamp, "hh:mm") }}</span>
        <div
          class="medal"
          v-if="show_medal && message.body.user.badge?.active"
          :style="{ background: message.body.user.badge?.color }"
        >
          <div class="medal-belong">
            {{ message.body.user.badge?.name }}
          </div>
          <div class="medal-level" :style="{ color: message.body.user.badge?.color }">
            {{ message.body.user.badge?.level }}
          </div>
        </div>
        <span class="name">{{ message.body.user.uname }} : </span>
      </div>
      <div :class="['message-right', { 'next-line': next_line }]" v-html="text"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DanmuMsg, Message } from "blive-message-listener"
import { computed, onMounted, ref } from "vue"
import { isEmpty } from "lodash"
import { format } from "../utils/utils"
import { useGlobal } from "../store"

const store = useGlobal()

const props = defineProps<{
  message: Message<DanmuMsg>
  show_medal: boolean
  show_time: boolean
  show_user: boolean
  next_line: boolean
}>()

const face = ref("")

const generate_img = (emoji: { url: string }, type: number) => {
  const class_list = ["emoticon", "emoji"]
  const { url } = emoji
  return `<img class="message-img ${class_list[type]}" src="${url}" />`
}

const text = computed(() => {
  const { emoticon, in_message_emoticon, content } = props.message.body
  if (!isEmpty(emoticon)) {
    return generate_img(emoticon, /official/.test(emoticon.id) ? 1 : 0)
  } else if (!isEmpty(in_message_emoticon)) {
    let text = content
    for (const key in in_message_emoticon) {
      text = text.replaceAll(key, generate_img(in_message_emoticon[key], 1))
    }
    return text
  } else return content
})

onMounted(async () => {
  face.value = props.message.body.user.face || ""
  if (!face.value) {
    await store.update_face(props.message.body.user.uid, face)
  }
})
</script>
<style lang="less"></style>
