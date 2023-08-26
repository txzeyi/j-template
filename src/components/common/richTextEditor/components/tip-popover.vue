<template>
  <transition name="fade">
    <div
      class="tip-popover"
      v-if="visible"
      :style="`top:${top}px;left:${left}px;`"
    >
      <div class="tip-popover-content">
        {{title}}
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
  }
})
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tip-popover{
  position: fixed;
  z-index: 100;
  .tip-popover-content{
    position: absolute;
    top: 0;
    left: 50%;
    padding: 7px 10px;
    white-space: nowrap;
    line-height: 1;
    font-size: 16px;
    color: #FFFFFF;
    background-color: #7c7b7a;
    border-radius: 5px;
    transform: translateX(-50%);
  }
  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: -11px;
    left: 50%;
    width: 0px;
    height: 0px;
    border: 6px solid transparent;
    border-bottom-color: #7c7b7a;
    transform: translateX(-50%);
    z-index: 10;
  }
}
</style>
