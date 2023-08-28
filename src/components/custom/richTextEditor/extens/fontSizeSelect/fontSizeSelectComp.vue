<template>
  <ListPopover :visible="visible && isClick" :top="top" :left="left">
    <div class="list-popover-item" v-for="item in list" :key="item.title" @click="selectItem(item)" style="width: 94px">
      <div class="list-popover-text" v-html="item.value"></div>
      <div class="list-popover-gou" v-if="item.isSelect">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M45.44 576a32.64 32.64 0 0 1 0-43.52L64 501.12a32 32 0 0 1 42.24-7.04L320 635.52a36.48 36.48 0 0 0 40.96 0l560.64-455.04a33.28 33.28 0 0 1 43.52 0l13.44 13.44a30.08 30.08 0 0 1 0 42.88l-601.6 601.6a49.28 49.28 0 0 1-69.12 0z"
            fill="#FF8909"
            p-id="3324"
          ></path>
        </svg>
      </div>
    </div>
  </ListPopover>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ListPopover from "../../components/list-popover.vue"
import { editorData } from "../../common/globalData"

export default defineComponent({
  props: {
    isClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      visible: false,
      list: []
    }
  },
  methods: {
    show(top, left) {
      this.top = top
      this.left = left
      this.visible = true
      this.list = [
        {
          value: "9px",
          isSelect: editorData.fontSize === "9px"
        },
        {
          value: "10px",
          isSelect: editorData.fontSize === "10px"
        },
        {
          value: "11px",
          isSelect: editorData.fontSize === "11px"
        },
        {
          value: "12px",
          isSelect: editorData.fontSize === "12px"
        },
        {
          value: "13px",
          isSelect: editorData.fontSize === "13px"
        },
        {
          value: "14px",
          isSelect: editorData.fontSize === "14px"
        },
        {
          value: "16px",
          isSelect: editorData.fontSize === "16px"
        },
        {
          value: "18px",
          isSelect: editorData.fontSize === "18px"
        },
        {
          value: "20px",
          isSelect: editorData.fontSize === "20px"
        },
        {
          value: "22px",
          isSelect: editorData.fontSize === "22px"
        },
        {
          value: "24px",
          isSelect: editorData.fontSize === "24px"
        },
        {
          value: "30px",
          isSelect: editorData.fontSize === "30px"
        },
        {
          value: "36px",
          isSelect: editorData.fontSize === "36px"
        }
      ]
    },
    hide() {
      this.visible = false
    },
    selectItem(item) {
      item.isSelect = true
      this.hide()
      this.$emit("selectItem", item.value)
    }
  },
  components: { ListPopover }
})
</script>
