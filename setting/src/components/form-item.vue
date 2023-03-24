<template>
  <div class="kl-form-item">
    <label for="" class="kl-form-item-label">{{ label }}</label>
    <div class="kl-form-item-content">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
<style lang="less">
.kl-form-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 8px;

  &-label {
    margin-right: 8px;
    font-family: SourceHanSansCN-Bold;
  }

  &-content {
    flex: 1;
    width: 0;
    // text-align: center;
  }
}
</style>
