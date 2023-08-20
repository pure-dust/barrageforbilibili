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
  background: #1b1b1b;
  font-family: SourceHanSansCN-Bold;
  color: #636363;

  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: -100%;
    background-color: rgba(73, 73, 73, 0.7);
    transition: 0.2s;
  }

  &:not(.active):hover {
    color: var(--primary-color);

    &::before {
      left: -50%;
    }
  }

  &.active {
    color: var(--primary-color);
  }

  &.active::before {
    left: 0;
  }

  .kl-switch-text {
    position: relative;
  }
}
</style>
