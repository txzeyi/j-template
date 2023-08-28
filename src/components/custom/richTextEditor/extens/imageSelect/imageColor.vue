<template>
  <div class="imageEditComp-buttom-item">
    <div
      class="imageEditComp-buttom-color"
      v-for="color in colors"
      :key="color"
      :style="`background-color:${color};`"
      @click="selectItem(color)"
      :class="{ active: color === activeColor }"
    ></div>
    <div
      class="imageEditComp-buttom-color"
      style="`background-color:#FFFFFF;border: 1px solid #EEEEEE;`"
      :class="{ active: '#FFFFFF' === activeColor }"
      @click="selectItem('#FFFFFF')"
    ></div>
    <span style="margin-left: 8px">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    title: {
      type: String,
      defalut: ""
    },
    defaultColor: {
      type: String,
      defalut: ""
    }
  },
  data() {
    return {
      colors: ["#1890FF", "#F5222D", "#52C41A", "#EB2F96", "#9800FC"],
      activeColor: "#1890FF"
    }
  },
  methods: {
    selectItem(value) {
      this.activeColor = value
      this.$emit("selectItem", value)
    }
  },
  watch: {
    defaultColor: {
      handler() {
        this.activeColor = this.defaultColor
      },
      immediate: true
    }
  }
})
</script>
<style lang="scss" scoped>
.imageEditComp-buttom-color {
  position: relative;
  margin-right: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
  &.active::after {
    content: " ";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAANZJREFUSEvtlF0NwjAUhc9RAChBAnUCOMABFkDBkIAEkICTOrikyd1S1vWPdW/rW9Pk+9LTe0osvLgwH6sgSFhETgCOAO4kn00jUninVkty10wwgjvHm6RpIpiAfwAYkna2IAV315glyMEHgYgYANf+5UvKVwL3BRbARsFnko+UpBTuC14ADh40KqmB+4ItACfZpyS18J9HFpGk5B94MEUxid6qb6jbDnOeG4hgTCMSn1MMj/YgIamCJ4s2IamGZ5uskpvmc3F/Sy7z8fmsr6JEtgqyKX0B+NJ2GdtPMBYAAAAASUVORK5CYII=);
    transform: translate(-50%, -50%);
  }
}
</style>
