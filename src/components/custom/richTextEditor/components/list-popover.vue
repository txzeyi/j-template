<template>
  <transition name="fade">
    <div class="list-popover" v-if="visible" :style="`top:${top}px;left:${left}px;`">
      <slot>
        <div class="list-popover-item" v-for="item in list" :key="item.title" @click="itemClick(item)">
          <div class="list-popover-icon" v-html="item.icon"></div>
          <div class="list-popover-text" v-html="item.title"></div>
        </div>
      </slot>
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
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    itemClick(item) {
      this.$emit("itemClick", item)
    }
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

.list-popover {
  position: fixed;
  top: 0;
  left: 0;
  padding: 8px 0;
  line-height: 1;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  border-radius: 5px;
  z-index: 100;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.14);
  .list-popover-item {
    position: relative;
    display: flex;
    padding: 10px 16px;
    line-height: 1;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      background-color: #f8f8f8;
    }
  }
  .list-popover-gou {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: -11px;
    left: 10px;
    width: 0px;
    height: 0px;
    border: 6px solid transparent;
    border-bottom-color: #fff;
    z-index: 10;
  }

  .list-popover-icon {
    margin-right: 10px;
    width: 18px;
    height: 18px;
  }
}
</style>
