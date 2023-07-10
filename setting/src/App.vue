<template>
  <setting-header @submit="on_save"></setting-header>
  <div class="main">
    <n-form label-placement="left" label-align="left" label-width="125" :show-feedback="false">
      <template v-for="cfg in config">
        <div class="setting-section">{{ cfg.label }}</div>
        <div class="danmu-section">
          <n-form-item v-for="item in cfg.cfg" :label="item.label">
            <switch-button
              v-if="item.type === 'switch'"
              v-model="setting[cfg.prop][item.prop]"
            ></switch-button>
            <input-number
              v-else-if="item.type === 'number'"
              v-model="setting[cfg.prop][item.prop]"
            ></input-number>
            <form-button v-else-if="item.type === 'btn'" @click="item.cb">{{
              item.text
            }}</form-button>
            <color-picker
              v-else="item.type === 'color'"
              v-model:value="setting[cfg.prop][item.prop]"
              :modes="['hex']"
            ></color-picker>
          </n-form-item>
        </div>
      </template>
    </n-form>
  </div>
  <shield-list
    :list="setting.shield.list"
    :visible="state.show_shield_list"
    @close="on_shield_close"
    @submit="on_shield_submit"
  ></shield-list>
</template>
<script setup lang="ts">
import { onMounted, reactive, watch } from "vue"
import { emit } from "@tauri-apps/api/event"
import { NColorPicker as colorPicker, NForm, NFormItem } from "naive-ui"

import { save_config, load_config } from "../../src/utils/setting"
import settingHeader from "./header.vue"
import switchButton from "./components/switch-button.vue"
import inputNumber from "./components/input-number.vue"
import formButton from "./components/form-button.vue"
import shieldList from "./components/shield-list.vue"

const state = reactive({
  show_shield_list: false,
})

const setting = reactive({
  danmu: {
    show_user: false,
    show_medal: true,
    show_time: true,
    next_line: false,
    time_text_size: 12,
    user_text_size: 12,
    danmu_text_size: 12,
    danmu_head_size: 36,
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
  apperance: {
    transparent: false,
    background: "",
  },
  setting: {
    transparent: false,
    background: "",
    color: "",
    size: 12,
  },
  shield: {
    list: [],
    level: 0,
  },
} as Setting)

const config = [
  {
    label: "弹幕",
    prop: "danmu",
    cfg: [
      { label: "是否显示头像", type: "switch", prop: "show_user" },
      { label: "是否显示勋章", type: "switch", prop: "show_medal" },
      { label: "是否显示时间", type: "switch", prop: "show_time" },
      { label: "弹幕是否换行", type: "switch", prop: "next_line" },
      { label: "时间字体大小", type: "number", prop: "time_text_size" },
      { label: "用户字体大小", type: "number", prop: "user_text_size" },
      { label: "弹幕字体大小", type: "number", prop: "danmu_text_size" },
      { label: "弹幕字体大小", type: "number", prop: "danmu_head_size" },
      { label: "时间字体颜色", type: "color", prop: "time_color" },
      { label: "用户字体颜色", type: "color", prop: "user_color" },
      { label: "弹幕字体颜色", type: "color", prop: "danmu_color" },
    ],
  },
  {
    label: "礼物",
    prop: "gift",
    cfg: [
      { label: "是否隐藏礼物信息", type: "switch", prop: "hidden" },
      { label: "是否显示勋章", type: "switch", prop: "show_medal" },
      { label: "用户字体大小", type: "number", prop: "user_text_size" },
      { label: "弹幕字体大小", type: "number", prop: "danmu_text_size" },
      { label: "用户字体颜色", type: "color", prop: "user_color" },
      { label: "弹幕字体颜色", type: "color", prop: "danmu_color" },
    ],
  },
  {
    label: "消息",
    prop: "interact",
    cfg: [
      { label: "是否隐藏插播信息", type: "switch", prop: "hidden" },
      { label: "是否显示勋章", type: "switch", prop: "show_medal" },
      { label: "用户字体大小", type: "number", prop: "user_text_size" },
      { label: "弹幕字体大小", type: "number", prop: "danmu_text_size" },
      { label: "用户字体颜色", type: "color", prop: "user_color" },
      { label: "弹幕字体颜色", type: "color", prop: "danmu_color" },
    ],
  },
  {
    label: "屏蔽设置",
    prop: "shield",
    cfg: [
      {
        label: "屏蔽列表",
        type: "btn",
        text: "打开列表",
        prop: "list",
        cb: () => {
          state.show_shield_list = true
        },
      },
      { label: "屏蔽等级", type: "number", prop: "level" },
    ],
  },
  {
    label: "本体外观",
    prop: "apperance",
    cfg: [
      { label: "透明", type: "switch", prop: "transparent" },
      { label: "背景色", type: "color", prop: "background" },
    ],
  },
  // {
  //   label: "设置外观",
  //   prop: "setting",
  //   cfg: [
  //     { label: "透明", type: "switch", prop: "transparent" },
  //     { label: "背景色", type: "color", prop: "background" },
  //     { label: "字体颜色", type: "color", prop: "color" },
  //     { label: "字体大小", type: "number", prop: "size" },
  //   ],
  // },
]

const on_shield_close = () => {
  state.show_shield_list = false
}

const on_shield_submit = (list: Array<number>) => {
  setting.shield.list = list
  save_config(setting)
  emit("save-config")
  state.show_shield_list = false
}

const on_save = async () => {
  await save_config(setting)
  emit("save-config")
}

watch(
  () => setting,
  (val) => {
    emit("update-config", val)
  },
  {
    deep: true,
  },
)

onMounted(async () => {
  let data = await load_config()

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      setting[key] = data[key]
    }
  }
})
</script>
<style lang="less">
.main {
  flex: 1;
  height: 0;
  padding: 0 6px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-track {
    display: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .setting-section {
    font-size: 14px;
    margin-bottom: 4px;
    font-family: SourceHanSansCN-Bold;
    padding-bottom: 4px;
    border-bottom: 1px solid #000;
  }

  .danmu-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
