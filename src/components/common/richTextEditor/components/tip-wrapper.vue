<template>
  <div class="title-popover-wrapper">
    <TipPopover
      v-for="item in list"
      :key="item.titie"
      :top="item.top"
      :left="item.left"
      :title="item.title"
      :visible="item.visible"
    ></TipPopover>
  </div>
</template>

<script lang="ts">
import TipPopover from './tip-popover.vue'
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: { TipPopover }
})
</script>
<style lang="scss"></style>
