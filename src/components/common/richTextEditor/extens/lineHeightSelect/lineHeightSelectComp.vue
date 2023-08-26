<template>
  <ListPopover :visible="visible && isClick" :top="top" :left="left">
    <div class="list-popover-item" v-for="item in list" :key="item.title" @click="selectItem(item)" style="width: 94px">
      <div class="list-popover-text" v-html="item.title"></div>
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
          title: "默认",
          value: "initial",
          isSelect: editorData.lineHeight === "" || editorData.lineHeight === "initial"
        },
        {
          title: "1.5",
          value: "1.5",
          isSelect: editorData.lineHeight === "1.5"
        },
        {
          title: "2",
          value: "2",
          isSelect: editorData.lineHeight === "2"
        },
        {
          title: "3",
          value: "3",
          isSelect: editorData.lineHeight === "3"
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
