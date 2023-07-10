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
  await store.update_face(props.message.body.user.uid, face)
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
  display: flex;
  align-items: center;

  .message-user {
    margin-right: 6px;

    .face-wrapper {
      width: calc(var(--danmu-head-size));
      padding-bottom: 100%;
      position: relative;
      transform: translateY(2px);

      img {
        inset: 0;
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
  }

  .message-body {
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
      vertical-align: middle;
      font-size: var(--danmu-size);
      color: var(--danmu-color);
      display: inline;
      line-height: 20px;
      line-height: var(--danmu-hieght);

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
        line-height: var(--danmu-hieght);
      }
    }
  }
}
</style>
