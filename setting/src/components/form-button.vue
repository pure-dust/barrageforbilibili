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
  background: #1b1b1b;
  transition: 0.2s;
  user-select: none;
  padding: 4px 8px;
  width: 120px;
  color: var(--primary-color);

  &:hover {
    background: #292929;
  }
}
</style>
