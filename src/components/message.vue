<template>
  <div class="message-item">
    <div class="message-left">
      <div v-if="show_user" class="message-user">
        <img :src="message.body.user.face" alt="" />
      </div>
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
</template>
<script setup lang="ts">
import { DanmuMsg, Message } from "blive-message-listener"
import { computed } from "vue"
import { isEmpty } from "lodash"
import { format } from "../utils/utils"

const props = defineProps<{
  message: Message<DanmuMsg>
  show_medal: boolean
  show_time: boolean
  show_user: boolean
  next_line: boolean
}>()

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
</script>
<style lang="less">
.message-item {
  font-size: 12px;
  padding: 4px;
  line-height: 18px;
  word-wrap: break-word;
  white-space: normal;
  font-family: SourceHanSansCN-Heavy;

  .message-time {
    color: var(--danmu-time-color);
    font-size: var(--danmu-time-size);
    vertical-align: middle;
    margin-right: 4px;
  }

  .message-left {
    display: inline;
    vertical-align: middle;

    .name {
      color: var(--danmu-user-color);
      font-size: var(--danmu-user-size);
      vertical-align: middle;
    }
  }

  .message-right {
    font-size: var(--danmu-size);
    color: var(--danmu-color);
    display: inline;
    line-height: 20px;
    vertical-align: middle;

    .emoji {
      height: 20px;
      vertical-align: middle;
    }

    .emoticon {
      height: 40px;
      vertical-align: middle;
    }

    &.next-line {
      display: flex;
      align-items: center;
      margin-top: 2px;
    }
  }
}
</style>
