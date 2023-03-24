<template>
  <div class="gift-item">
    <div class="gift-left">
      <div
        class="medal"
        v-if="show_medal && gift.body.user.badge?.active"
        :style="{ backgroundColor: gift.body.user.badge?.color }"
      >
        <div class="medal-belong">
          {{ gift.body.user.badge?.name }}
        </div>
        <div class="medal-level" :style="{ color: gift.body.user.badge?.color }">
          {{ gift.body.user.badge?.level }}
        </div>
      </div>
    </div>
    <div class="gift-right">
      <span class="name">{{ gift.body.user.uname }} </span>
      <span class="action">投喂</span>
      <span class="gift-count">{{ gift.body.amount }}</span>
      <span class="gift-name">{{ gift.body.gift_name }}</span>
      <div :class="`gift-img gift-${props.gift.body.gift_id}-40`"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { GiftMsg, Message } from "blive-message-listener"
const props = defineProps<{
  gift: Message<GiftMsg>
  show_medal: boolean
}>()
</script>
<style lang="less">
.gift-item {
  font-size: 12px;
  padding: 4px;
  line-height: 18px;
  word-wrap: break-word;
  white-space: normal;

  .gift-left {
    display: inline;
  }

  .gift-right {
    display: inline;
    line-height: 20px;
    vertical-align: middle;
    align-items: center;

    .name {
      color: var(--gift-user-color);
      font-size: var(--gift-user-size);
      margin-right: 4px;
    }

    .action {
      color: var(--gift-user-color);
      font-size: var(--gift-user-size);
    }

    .gift-count {
      margin: 0 4px;
    }

    .gift-name {
      font-size: var(--gift-size);
      color: var(--gift-color);
      margin-right: 4px;
    }

    .gift-img {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>
