<template>
  <div class="kl-input-number">
    <input
      ref="input"
      @input="on_input"
      @blur="on_blur"
      class="kl-input-number-inner"
      type="number"
      name=""
      id=""
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue"

const props = defineProps<{
  modelValue: number | string
}>()

const emit = defineEmits<{
  (event: "update:modelValue", val: number): void
  (event: "blur"): void
}>()

const input = ref<HTMLInputElement>()

watch(
  () => props.modelValue,
  (val) => {
    input.value!.value = val + ""
  },
)

const focus = () => {
  input.value?.focus()
}

defineExpose({
  focus
})

const on_blur = () => {
  emit("blur")
}

const on_input = (evt: Event) => {
  let dom = evt.target as HTMLInputElement
  emit("update:modelValue", +dom.value)
}

onMounted(() => {
  input.value!.value = props.modelValue + ""
})
</script>
<style lang="less">
.kl-input-number {
  display: inline-block;
  vertical-align: middle;
  width: 120px;

  &-inner {
    width: 100%;
    appearance: none;
    border: 1px solid #8ba8c4;
    border-color: transparent;
    padding: 4px 8px;
    outline: none;
    text-align: center;
    background: rgba(73, 73, 73, 0.7);
    transition: 0.2s;
    font-family: SourceHanSansCN-Bold;
    font-size: 12px;
    color: var(--primary-color);

    &::selection {
      color: var(--primary-color);
      background: #000;
    }

    &:hover,
    &:focus {
      border-color: #000;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
    }
  }
}
</style>
