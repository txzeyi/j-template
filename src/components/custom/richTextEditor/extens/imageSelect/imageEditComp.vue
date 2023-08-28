<template>
  <j-dialog title="图片编辑" width="752px" v-model="visible">
    <div class="imageEditComp-content">
      <div class="imageEditComp-cropper">
        <canvas width="710" height="512" style="width: 710px; height: 512px" ref="canvas"></canvas>
      </div>
    </div>
    <template #footer>
      <div class="p-6 w-full flex items-center imageEditComp-footer">
        <el-button @click="hide">取消裁剪修改</el-button>
        <el-button type="primary" @click="saveChange">保存裁剪修改</el-button>
      </div>
    </template>
  </j-dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue"
import ImageEditor from "./imageEditor/imageEditor"
import ImageColor from "./imageColor.vue"

export default defineComponent({
  data() {
    return {
      top: 0,
      left: 0,
      visible: false
    }
  },
  methods: {
    show(url, callBack) {
      this.url = url
      this.visible = true
      this.callBack = callBack
      nextTick(() => {
        this.instance = new ImageEditor(this.$refs.canvas)
        this.instance.setValue(url)
        this.instance.model = 0
      })
    },
    hide() {
      this.visible = false
      this.instance.destroy()
    },
    saveChange() {
      if (this.instance && this.instance.imageRect.img) {
        this.url = this.instance.output()
        this.callBack && this.callBack(this.url)
        this.hide()
      }
    }
  },
  components: {
    // ImageColor
  }
})
</script>
<style lang="scss" scoped>
.imageEditComp-content {
  padding: 20px;
}

.imageEditComp-cropper {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
  border: 1px solid #f9f9f9;
}

.imageEditComp-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #eeeeee;
}

.imageEditComp-buttom {
  display: flex;
  justify-content: center;
  padding: 0 0 24px 33px;
  .imageEditComp-buttom-item {
    display: flex;
    align-items: center;
    margin-right: 16px;
    padding: 0 20px;
    height: 32px;
    font-size: 16px;
    color: #707070;
    background: rgba(255, 255, 255, 0.39);
    border: 1px solid #eeeeee;
    white-space: nowrap;
    border-radius: 8px;
    svg {
      fill: currentColor;
    }
    &:hover,
    &.active {
      cursor: pointer;
      color: #ff8909;
      border: 1px solid #ff8909;
    }
  }
}
</style>
