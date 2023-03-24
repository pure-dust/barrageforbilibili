<template>
  <div :class="['kl-switch-button', { active: modelValue }]" @click="on_switch">
    <span class="kl-switch-text"> {{ modelValue ? active : inactive }}</span>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    active?: string
    inactive?: string
    modelValue: boolean
  }>(),
  {
    active: "是",
    inactive: "否",
  },
)

const emit = defineEmits<{
  (event: "update:modelValue", val: boolean): void
}>()

const on_switch = () => {
  emit("update:modelValue", !props.modelValue)
}
</script>
<style lang="less">
.kl-switch-button {
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  height: 27px;
  min-width: 120px;
  overflow: hidden;
  position: relative;
  transition: 0.2s;
  user-select: none;
  background: rgba(255, 255, 255, 0.35);
  font-family: SourceHanSansCN-Bold;

  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: -100%;
    background-color: #000;
    transition: 0.2s;
  }

  &:not(.active):hover {
    color: #e0f3fe;

    &::before {
      left: -50%;
    }
  }

  &.active {
    color: #e0f3fe;
  }

  &.active::before {
    left: 0;
  }

  .kl-switch-text {
    position: relative;
  }
}
</style>
