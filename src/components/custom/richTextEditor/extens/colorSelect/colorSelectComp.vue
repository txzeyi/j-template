<template>
  <ListPopover :visible="visible && isClick" :top="top" :left="left" style="padding: 5px 0 0 0">
    <div @click.stop>
      <div class="colorSelect-header" @click="selectItem('#000000')">
        <div class="colorSelect-item" style="margin-right: 7px">
          <div class="colorSelect-grid" style="background-color: #000000"></div>
        </div>
        <span class="colorSelect-label">默认</span>
      </div>
      <div class="colorSelect-content">
        <div
          class="colorSelect-item"
          v-for="color in list"
          :key="color"
          :class="{
            active: color.toLocaleLowerCase() === value.toLocaleLowerCase()
          }"
          @click="selectItem(color)"
        >
          <div class="colorSelect-grid" :style="`background-color: ${color};`"></div>
        </div>
      </div>
      <div class="colorSelect-custom-header">
        <span class="colorSelect-label">最近使用自定义颜色</span>
      </div>
      <div class="colorSelect-content" style="padding-bottom: 10px">
        <div
          class="colorSelect-item"
          v-for="color in customList"
          :key="color"
          :class="{
            active: color.toLocaleLowerCase() === value.toLocaleLowerCase()
          }"
          @click="selectItem(color)"
        >
          <div class="colorSelect-grid" :style="`background-color: ${color};`"></div>
        </div>
      </div>
      <div class="colorSelect-footer">
        <el-color-picker show-alpha @change="colorChange" />
        <img src="./images/colorIcon.png" style="width: 18px; margin-right: 10px" />
        <span class="colorSelect-label">更多颜色</span>
        <div class="colorSelect-arrow">
          <svg viewBox="0 0 1024 1024" width="10" height="10">
            <path
              d="M747.52 585.728L356.352 952.32a66.56 66.56 0 0 1-112.64-49.152V120.832A66.56 66.56 0 0 1 356.352 71.68L747.52 438.272a102.4 102.4 0 0 1 0 147.456z"
              fill="#707070"
              p-id="3176"
            ></path>
          </svg>
        </div>
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
      value: "",
      list: [
        "#000000",
        "#262626",
        "#595959",
        "#8C8C8C",
        "#BFBFBF",
        "#D9D9D9",
        "#E9E9E9",
        "#F5F5F5",
        "#FAFAFA",
        "#FFFFFF",
        "#F5222D",
        "#FA541C",
        "#FA8C16",
        "#FADB14",
        "#52C41A",
        "#13C2C2",
        "#1890FF",
        "#2F54EB",
        "#722ED1",
        "#EB2F96",
        "#FFE8E6",
        "#FFECE0",
        "#FFEFD1",
        "#FCFCCA",
        "#E4F7D2",
        "#D3F5F0",
        "#D4EEFC",
        "#DEE8FC",
        "#EFE1FA",
        "#FAE1EB",
        "#FFA39E",
        "#FFBB96",
        "#FFD591",
        "#FFFB8F",
        "#B7EB8F",
        "#87E8DE",
        "#91D5FF",
        "#ADC6FF",
        "#D3ADF7",
        "#FFADD2",
        "#FF4D4F",
        "#FF7A45",
        "#FFA940",
        "#FFEC3D",
        "#73D13D",
        "#36CFC9",
        "#40A9FF",
        "#597EF7",
        "#9254DE",
        "#F759AB",
        "#CF1322",
        "#D4380D",
        "#D46B08",
        "#D4B106",
        "#389E0D",
        "#08979C",
        "#096DD9",
        "#1D39C4",
        "#531DAB",
        "#EB2F96",
        "#C41D7F",
        "#820014",
        "#871400",
        "#873800",
        "#614700",
        "#135200",
        "#00474F",
        "#061178",
        "#22075E",
        "#780650"
      ],
      customList: []
    }
  },
  methods: {
    show(top, left) {
      this.value = editorData.color
      this.top = top
      this.left = left
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    selectItem(color) {
      this.value = color
      editorData.color = color
      this.hide()
      this.$emit("selectItem", color)
    },
    colorChange(color) {
      this.customList.push(color)
    }
  },
  components: { ListPopover }
})
</script>
<style lang="scss">
.colorSelect-header {
  display: flex;
  align-items: center;
  padding: 7px 9px;
  box-sizing: border-box;
  &:hover {
    cursor: pointer;
    background-color: #dee0e2;
  }
}
.colorSelect-content {
  padding: 0 9px;
  width: 280px;
  box-sizing: border-box;
}
.colorSelect-item {
  display: inline-block;
  vertical-align: top;
  padding: 3px;
  width: 26px;
  box-sizing: border-box;
  border-radius: 3px;
  overflow: hidden;
  box-sizing: border-box;

  &.active {
    border: 1px solid #cccccc;
    border-radius: 3px;
  }
  &:hover {
    cursor: pointer;
    background-color: #e3e3e3;
  }
  .colorSelect-grid {
    width: 18px;
    height: 18px;
  }
}
.colorSelect-label {
  font-size: 13px;
  color: #707070;
}

.colorSelect-custom-header {
  padding: 10px 12px 5px 12px;
}

.colorSelect-footer {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 12px;
  height: 44px;
  background-color: #f5f5f5;
  z-index: 10;
  &:hover {
    cursor: pointer;
    background-color: #dee0e2;
  }
  .colorSelect-arrow {
    position: absolute;
    top: 50%;
    right: 12px;
    width: 10px;
    font-size: 10px;
    transform: translateY(-50%);
  }
  .el-color-picker {
    position: absolute;
    width: 100%;
    z-index: 1;
    opacity: 0;
  }
  .el-color-picker__trigger {
    width: 100%;
  }
}
</style>
