<template>
  <div :class="['barrage', { locked: lock }]">
    <div class="main-wrapper" ref="wrapper" @wheel.stop.capture.passive="on_wheel">
      <transition-group name="danmu">
        <template v-for="item in state.message_list" :key="item.id">
          <message
            v-if="item.type === 'DANMU_MSG'"
            :show_medal="config.danmu.show_medal"
            :show_time="config.danmu.show_time"
            :show_user="config.danmu.show_user"
            :next_line="config.danmu.next_line"
            :message="(item as Message<DanmuMsg>)"
          ></message>
          <gift
            :show_medal="config.gift.show_medal"
            v-else-if="item.type === 'SEND_GIFT'"
            :gift="(item as Message<GiftMsg>)"
          ></gift>
        </template>
      </transition-group>
    </div>
    <div class="interact" v-if="show_interact">
      <Transition name="interact" mode="out-in">
        <div class="interact-wrapper" v-show="state.interact_animate">
          <div
            class="medal"
            v-show="config.interact.show_medal && state.interact.body.user.badge?.active"
            :style="{ background: state.interact.body.user.badge?.color }"
          >
            <div class="medal-belong">
              {{ state.interact.body.user.badge?.name }}
            </div>
            <div class="medal-level" :style="{ color: state.interact.body.user.badge?.color }">
              {{ state.interact.body.user.badge?.level }}
            </div>
          </div>
          <div class="interact-msg">
            <span class="interact-msg-name"> {{ state.interact.body.user.uname }} </span>
            <span class="interact-msg-text">进入直播间 </span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { listen } from "@tauri-apps/api/event"
import { startListen } from "blive-message-listener/browser"
import { useRoute } from "vue-router"
import { DanmuMsg, UserActionMsg, GiftMsg, MessageListener } from "blive-message-listener"
import { storeToRefs } from "pinia"

import message from "../components/message.vue"
import gift from "../components/gift.vue"
import { is_empty } from "../utils/utils"
import { set_vars, load_config } from "../utils/setting"
import { get_room_info, get_gift_config } from "../api"
import { useGlobal } from "../store"
import decode_danmuv2 from "../utils/danmuv2"

const route = useRoute()
const { lock } = storeToRefs(useGlobal())

const state = reactive({
  is_loaded: false,
  room_id: "",
  message_list: [] as Array<Message<DanmuMsg> | Message<GiftMsg>>,
  message_queue: [] as Array<Message<DanmuMsg> | Message<GiftMsg>>,
  interact_queue: [] as Array<Message<UserActionMsg>>,
  interact: {} as Message<UserActionMsg>,
  message_tick: null as unknown as NodeJS.Timeout,
  interact_tick: null as unknown as NodeJS.Timeout,
  interact_animate: true,
  auto_scroll: true,
  message_speed: 500,
})

watch(
  () => state.message_queue,
  (val) => {
    if (val.length > 100) {
      state.message_speed = 10
    } else if (val.length > 50) {
      state.message_speed = 50
    } else if (val.length > 20) {
      state.message_speed = 100
    } else if (val.length > 10) {
      state.message_speed = 300
    } else {
      state.message_speed = 500
    }
  },
  {
    deep: true,
  },
)

watch(
  () => state.message_speed,
  () => {
    start_message()
  },
)

const config = reactive({
  danmu: {
    show_user: false,
    show_medal: true,
    show_time: true,
    next_line: false,
    time_text_size: 12,
    user_text_size: 12,
    danmu_text_size: 12,
    time_color: "",
    user_color: "",
    danmu_color: "",
  },
  gift: {
    hidden: false,
    show_medal: true,
    user_text_size: 12,
    danmu_text_size: 12,
    user_color: "",
    danmu_color: "",
  },
  interact: {
    hidden: false,
    show_medal: true,
    user_text_size: 12,
    danmu_text_size: 12,
    user_color: "",
    danmu_color: "",
  },
  shield: {
    list: [] as Array<number>,
    level: 0,
  },
})

const wrapper = ref<HTMLElement>()

const show_interact = computed(() => {
  return !config.interact.hidden && !is_empty(state.interact)
})

const start_message = () => {
  stop_message()
  state.message_tick = setInterval(() => {
    if (state.message_queue.length === 0) {
      stop_message()
      return
    }
    state.message_list.push(state.message_queue.shift()!)
    if (state.message_list.length > 100) {
      state.message_list.shift()
    }
    nextTick(() => {
      if (wrapper.value && state.auto_scroll) {
        wrapper.value!.scrollTop = wrapper.value!.scrollHeight
      }
    })
  }, state.message_speed)
}

const stop_message = () => {
  clearInterval(state.message_tick)
  state.message_tick = null as unknown as NodeJS.Timeout
}

const start_interact = () => {
  stop_interact()
  state.interact_tick = setInterval(() => {
    if (state.interact_queue.length === 0) {
      stop_interact()
      return
    }
    state.interact_animate = false
    setTimeout(() => {
      state.interact = state.interact_queue.shift()!
      state.interact_animate = true
    }, 50)
  }, 500)
}

const stop_interact = () => {
  clearInterval(state.interact_tick)
  state.interact_tick = null as unknown as NodeJS.Timeout
}

const on_wheel = (evt: WheelEvent) => {
  const dom = evt.currentTarget as HTMLElement
  state.auto_scroll = dom.scrollHeight - dom.scrollTop <= wrapper.value!.offsetHeight + 24
}

const update_config = (data: Setting) => {
  set_vars(data)
  config.danmu = data.danmu
  config.gift = data.gift
  config.interact = data.interact
  config.shield.list = data.shield.list
  config.shield.level = data.shield.level
}

const deal_message = (msg: Message<DanmuMsg> | Message<GiftMsg>) => {
  if (config.shield.list.includes(msg.body.user.uid)) {
    return
  }
  msg.body.user.face = decode_danmuv2(msg.raw.dm_v2)
  let last = state.message_queue.at(-1) || state.message_list.at(-1)
  if (msg.type === "SEND_GIFT" && last?.type === "SEND_GIFT") {
    if (msg.body.user.uid === last?.body.user.uid) {
      if ((msg as Message<GiftMsg>).body.gift_id === (last as Message<GiftMsg>).body.gift_id) {
        ;(last as Message<GiftMsg>).body.amount += (msg as Message<GiftMsg>).body.amount
        return
      }
    }
  } else {
    state.message_queue.push(msg)
  }
  start_message()
}

const init_gift = async () => {
  const { list } = await get_gift_config(+state.room_id)
  let str = ""
  list.forEach((gift) => {
    str += `.gift-${gift.id}-20 { background-image: url(${gift.webp}); background-size: 100% auto; width: 20px; height: 20px; } \n`
    str += `.gift-${gift.id}-40 { background-image: url(${gift.webp}); background-size: 100% auto; width: 40px; height: 40px; } \n`
    str += `.gift-${gift.id}-80 { background-image: url(${gift.webp}); background-size: 100% auto; width: 80px; height: 80px; } \n`
  })
  let style = document.createElement("style")
  style.innerText = str
  document.head.append(style)
}

listen<Setting>("update-config", (evt) => {
  update_config(evt.payload)
})

let listender: MessageListener | null = null

onMounted(async () => {
  let data = await load_config()
  update_config(data)
  state.room_id = (await (await get_room_info(+(route.params.id as string))).room_id) + ""
  await init_gift()
  listender = startListen(+state.room_id, {
    onIncomeDanmu: deal_message,
    onGift: deal_message,
    onUserAction: (msg) => {
      state.interact_queue.push(msg)
      start_interact()
    },
  })
  document.addEventListener("wheel", on_wheel)
})

onUnmounted(() => {
  stop_interact()
  stop_message()
  document.removeEventListener("wheel", on_wheel)
  listender?.close()
})
</script>
<style lang="less"></style>
