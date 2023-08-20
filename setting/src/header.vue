<template>
  <div class="setting-header" data-tauri-drag-region>
    弹幕姬设置
    <button class="submit-btn" @click="on_submit">保存</button>
    <span class="close" @click="on_close">
      <svg class="icon">
        <use xlink:href="#kl-close"></use>
      </svg>
    </span>
  </div>
</template>
<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window"

const emit = defineEmits<{
  (event: "submit"): void
}>()

const on_submit = () => {
  emit("submit")
}

const on_close = async () => {
  await appWindow.close()
}
</script>
<style lang="less">
.setting-header {
  display: flex;
  align-items: center;
  font-style: italic;
  padding: 8px 6px 2px;
  font-family: SourceHanSansCN-Bold;
  margin-bottom: 4px;
  color: var(--primary-color);

  .submit-btn {
    margin-left: 16px;
    font-family: SourceHanSansCN-Bold;
    appearance: none;
    border: none;
    outline: none;
    padding: 2px 10px;
    font-size: 12px;
    cursor: pointer;
    background: #1b1b1b;
    transition: 0.2s;
    user-select: none;
    color: var(--primary-color);

    &:hover {
      background: #3d3d3d;
      color: var(--primary-color);
    }
  }

  .close {
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
