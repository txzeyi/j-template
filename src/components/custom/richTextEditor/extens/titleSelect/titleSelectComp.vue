<template>
  <ListPopover :visible="visible && isClick" :top="top" :left="left" :list="list" @itemClick="selectItem"></ListPopover>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import ListPopover from "../../components/list-popover.vue"
import { H1, H2, H3, P } from "./titleSelect"
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
          icon: P,
          title: "正文",
          value: "p",
          isSelect: editorData.titleValue === "p"
        },
        {
          icon: H1,
          title: "一级标题",
          value: "h1",
          isSelect: editorData.titleValue === "h1"
        },
        {
          icon: H2,
          title: "二级标题",
          value: "h2",
          isSelect: editorData.titleValue === "h2"
        },
        {
          icon: H3,
          title: "三级标题",
          value: "h3",
          isSelect: editorData.titleValue === "h3"
        }
      ]
    },
    hide() {
      this.visible = false
    },
    selectItem(item) {
      item.isSelect = true
      this.hide()
      this.$emit("selectItem", item)
    }
  },
  components: { ListPopover }
})
</script>
