<template>
  <div class="shield-list" v-if="props.visible">
    <div class="shield-header">屏蔽列表</div>
    <div class="shield-body">
      <div class="list-item" v-for="item in state.list">
        {{ item }}
        <div class="delete-btn" @click="on_delete(item)">删除</div>
      </div>
      <input-number
        v-if="state.add_new"
        @blur="on_ensure"
        style="width: 100%"
        v-model="state.new_item"
        ref="input"
      ></input-number>
      <div class="add-item" @click="on_addnew">新增</div>
    </div>
    <div class="shield-footer">
      <form-button @click="on_submit">确定</form-button>
      <form-button @click="on_close">返回</form-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import formButton from "./form-button.vue"
import inputNumber from "./input-number.vue"

const props = defineProps<{
  list: Array<number>
  visible: boolean
}>()

const emit = defineEmits<{
  (event: "close"): void
  (event: "submit", list: Array<number>): void
}>()

const state = reactive({
  list: [] as Array<number>,
  new_item: "",
  add_new: false,
})

const input = ref()

const on_addnew = () => {
  state.add_new = true
  nextTick(() => {
    input.value.focus()
  })
}

const on_ensure = () => {
  if (+state.new_item === 0) {
    state.add_new = false
    return
  }
  if (state.list.includes(+state.new_item)) {
    return
  }

  state.list.push(+state.new_item)
  state.new_item = ""
  state.add_new = false
}

const on_delete = (item: number) => {
  state.list.splice(
    state.list.findIndex((i) => i === item),
    1,
  )
}

const on_submit = () => {
  emit("submit", state.list)
}

const on_close = () => {
  emit("close")
}

watch(
  () => props.list,
  (val) => {
    state.list = val
  },
)

onMounted(() => {
  state.list = props.list
})
</script>
<style lang="less">
.shield-list {
  position: fixed;
  inset: 48px;
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: #fff
    linear-gradient(
      -45deg,
      rgba(176, 209, 217, 0.9) -20%,
      rgba(176, 209, 217, 0.4) 50%,
      rgba(176, 209, 217, 0.9) 120%
    );
  box-shadow: 0 0 15px #999;
  transition: 0.2s;
  transform-origin: center;
  animation: enter 0.3s 1 forwards;

  @keyframes enter {
    0% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }

  .shield-header {
    font-family: SourceHanSansCN-Bold;
    margin-bottom: 8px;
  }

  .shield-body {
    flex: 1;
    height: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 27px;
    align-items: center;
    gap: 10px;

    .list-item {
      padding: 2px 4px;
      height: 100%;
      width: 100%;
      position: relative;
      overflow: hidden;
      text-align: center;
      font-family: SourceHanSansCN-Bold;

      &:hover {
        .delete-btn {
          left: 80%;
        }
      }

      .delete-btn {
        cursor: pointer;
        white-space: nowrap;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 100%;
        font-size: 12px;
        background: #000;
        color: #fff;
        padding: 2px 4px;
        transition: 0.2s;
      }
    }

    .add-item {
      cursor: pointer;
      padding: 2px 4px;
      height: 100%;
      width: 100%;
      text-align: center;
      background: #000;
      color: #fff;
      font-family: SourceHanSansCN-Bold;
    }
  }

  .shield-footer {
    margin-top: 8px;
    display: flex;
    justify-content: center;

    button {
      margin: 0 5px;
    }
  }
}
</style>
