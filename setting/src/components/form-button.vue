<template>
  <button class="form-button" @click="on_click">
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (event: "click") : void
}>()

const on_click = () => {
  emit("click")
}
</script>
<style lang="less">
.form-button {
  display: inline-block;
  font-family: SourceHanSansCN-Bold;
  appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.35);
  transition: 0.2s;
  user-select: none;
  padding: 4px 8px;
  width: 120px;

  &:hover {
    background: #000;
    color: #fff;
  }
}
</style>
