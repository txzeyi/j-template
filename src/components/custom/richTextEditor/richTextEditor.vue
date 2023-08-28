<template>
  <el-dialog class="tinymce-dialog" :model-value="visible" @close="close" :show-close="false" fullscreen>
    <div class="tinymce-header">
      <div class="tinymce-header-item">
        <img src="@/assets/layout/logo-text-1.png" class="tinymce-header-logo" />
        <div class="tinymce-header-line"></div>
        <span class="tinymce-header-text">{{ title }}</span>
      </div>
      <div class="tinymce-header-item">
        <img v-if="userInfo.avatar" :src="userInfo.avatar" class="tinymce-header-avatar" />
        <img v-else src="@/assets/image/avatar.png" class="tinymce-header-avatar" />
        <span class="tinymce-header-text">{{ userInfo.userName }}</span>
      </div>
    </div>
    <div v-loading="loading" class="tinymce-container" @click="hideAllPopver" @mouseover="mouseoverBtn" ref="wrapper">
      <textarea :id="tinymceId" class="tinymce-textarea" />
      <TipWrapper :list="buttoms"></TipWrapper>
      <TitleSelectComp @selectItem="titleSelectCompClick" :isClick="isClick" ref="titleSelectComp"></TitleSelectComp>
      <ColorSelectComp @selectItem="colorSelectCompClick" :isClick="isClick" ref="colorSelectComp"></ColorSelectComp>
      <BgColorSelectComp @selectItem="bgColorSelectCompClick" :isClick="isClick" ref="bgColorSelectComp"></BgColorSelectComp>
      <FontSizeSelectComp @selectItem="fontSizeSelectCompClick" :isClick="isClick" ref="fontSizeSelectComp"></FontSizeSelectComp>
      <LineHeightSelectComp @selectItem="lineHeightSelectCompClick" :isClick="isClick" ref="lineHeightSelectComp"></LineHeightSelectComp>
      <ListSelectComp @selectItem="listSelectCompClick" :isClick="isClick" ref="listSelectComp"></ListSelectComp>
      <ImageItemSelectComp @selectItem="imageItemSelectCompClick" :isClick="isClick" ref="imageItemSelectComp"></ImageItemSelectComp>
      <ImageEditComp ref="imageEditComp"></ImageEditComp>
      <LinkSelectComp @selectItem="linkSelectCompClick" :isClick="isClick" ref="linkSelectComp"></LinkSelectComp>
    </div>
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer" style="padding: 3px 0; position: relative">
          <div class="tinymce-footer-fontCount">正文数字：{{ fontCount }}字</div>
          <el-button class="btn-default" @click.stop="close">取消</el-button>
          <el-button type="primary" :loading="isLoading" :disabled="loading" class="!border-0" @click.stop="confirm">确定</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { defaultStyle } from "./common/style"
import { titleSelectRegistered } from "./extens/titleSelect/titleSelect"
import TitleSelectComp from "./extens/titleSelect/titleSelectComp.vue"
import { colorSelectRegistered } from "./extens/colorSelect/colorSelect"
import ColorSelectComp from "./extens/colorSelect/colorSelectComp.vue"
import { bgColorSelectRegistered } from "./extens/bgColorSelect/bgColorSelect"
import BgColorSelectComp from "./extens/bgColorSelect/bgColorSelectComp.vue"
import { fontSizeSelectRegistered } from "./extens/fontSizeSelect/fontSizeSelect"
import FontSizeSelectComp from "./extens/fontSizeSelect/fontSizeSelectComp.vue"
import { listSelectRegistered } from "./extens/listSelect/listSelect"
import ListSelectComp from "./extens/listSelect/listSelectComp.vue"
import { lineHeightSelectRegistered } from "./extens/lineHeightSelect/lineHeightSelect"
import LineHeightSelectComp from "./extens/lineHeightSelect/lineHeightSelectComp.vue"
import { imageSelectRegistered } from "./extens/imageSelect/imageSelect"
import ImageItemSelectComp from "./extens/imageSelect/imageItemSelectComp.vue"
import ImageEditComp from "./extens/imageSelect/imageEditComp.vue"
import { linkSelectRegistered } from "./extens/linkSelect/linkSelect"
import { videoSelectRegistered } from "./extens/videoSelect/videoSelect"
import LinkSelectComp from "./extens/linkSelect/linkSelectComp.vue"
import { getToolbarTarget, getToolbarTitlePoper } from "./common/utils"
import TipWrapper from "./components/tip-wrapper.vue"
import mediaPicker from "@/components/business/YjFileUpload"
import { guid } from "@/utils/common"
import { fetchUpFile } from "@/service"
import { getUserInfo } from "@/utils/auth"

declare const window: any

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "云镜头条写文章"
    },
    content: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    const { info } = useStore("system")
    const userInfo = getUserInfo()
    return { info, userInfo }
  },
  data() {
    return {
      tinymceId: `vue-tinymce-${Date.now()}`,
      loading: false,
      isClick: false,
      isLoading: false,
      fontCount: 0,
      buttoms: []
    }
  },
  methods: {
    async init() {
      const that = this
      this.loading = true
      if (!window.hasOwnProperty("tinymce")) {
        await this.loadScript()
      }
      const toolbars = [
        "undo redo removeformat formatpainter",
        "titleSelect bold italic colorSelect bgColorSelect fontSizeSelect",
        "listSelect hr alignleft aligncenter alignright lineHeightSelect",
        "imageSelect videoSelect linkSelect" // pagebreak
      ]
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: "100%",
        body_class: "panel-body",
        object_resizing: false,
        toolbar: toolbars.join("|"),
        plugins: "formatpainter hr advlist lists pagebreak",
        menu: {},
        menubar: "",
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        default_link_target: "_blank",
        fontsize_formats: "10px 12px 14px 18px 24px 36px",
        link_title: false,
        branding: false, // 去掉右下角TINY驱动商标
        convert_urls: false,
        statusbar: false, // 隐藏底部
        // 格式刷
        formatpainter_removeformat: [
          {
            selector: "b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins",
            remove: "all",
            split: true,
            expand: false,
            block_expand: true,
            deep: true
          },
          { selector: "span", attributes: ["style", "class"], remove: "empty", split: true, expand: false, deep: true },
          { selector: "*:not(tr,td,th,table)", attributes: ["style", "class"], split: false, expand: false, deep: true }
        ],
        content_style: defaultStyle, // 生成富文本meta插入style样式
        setup(editor) {
          that.editor = editor
          titleSelectRegistered(editor, that.titleSelectCompShow, that.$refs.wrapper) // 标题
          colorSelectRegistered(editor, that.colorSelectCompShow, that.$refs.wrapper) // 字体颜色
          bgColorSelectRegistered(editor, that.bgColorSelectCompShow, that.$refs.wrapper) // 字体颜色
          fontSizeSelectRegistered(editor, that.fontSizeSelectCompShow, that.$refs.wrapper) // 字体大小
          lineHeightSelectRegistered(editor, that.lineHeightSelectCompShow, that.$refs.wrapper) // 行高
          listSelectRegistered(editor, that.listSelectCompShow, that.$refs.wrapper) // 有序无序列表
          imageSelectRegistered(editor, that.imageSelectCompShow, that.imageItemSelectCompShow, that.$refs.wrapper) // 图片
          linkSelectRegistered(editor, that.linkSelectCompShow) // 链接
          videoSelectRegistered(editor, that.videoSelectCompShow) // 视频
          setTimeout(function () {
            that.loading = false
            that.setContent(that.content)
            that.getFontCount()
          }, 600)
        }
      })
    },
    loadScript() {
      return new Promise((res, rej) => {
        const script = document.createElement("script")
        script.src = "./tinymce/tinymce.min.js"
        script.onload = res
        document.body.appendChild(script)
      })
    },
    mouseoverBtn(e) {
      if (this.isClick) return this.hideButtoms()
      let wrapper = this.$refs.wrapper
      let target = getToolbarTarget(wrapper)
      if (target && target.nodeName == "BUTTON") {
        const title = getToolbarTitlePoper(target.title)
        if (title) {
          const rect = target.getBoundingClientRect()
          let instance = this.buttoms.find((item) => item.title === title)
          this.hideButtoms()
          if (instance) {
            instance.visible = true
          } else {
            instance = {
              title,
              top: rect.top + rect.height + 12,
              left: rect.left + rect.width / 2,
              visible: false
            }
            this.buttoms.push(instance)
            setTimeout(() => {
              instance.visible = true
            }, 100)
          }
        }
      } else {
        return this.hideButtoms()
      }
    },
    // 标题选项
    titleSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.titleSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    titleSelectCompClick(item) {
      this.editor.execCommand("FormatBlock", false, item.value)
    },
    // 字体颜色选项
    colorSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.colorSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    colorSelectCompClick(color) {
      this.editor.execCommand("ForeColor", false, color)
    },
    // 背景颜色选项
    bgColorSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.bgColorSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    bgColorSelectCompClick(color) {
      if (color) {
        this.editor.execCommand("HiliteColor", false, color)
      } else {
        this.editor.execCommand("mceRemoveTextcolor", "hilitecolor")
      }
    },
    // 字体大小选项
    fontSizeSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.fontSizeSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    fontSizeSelectCompClick(size) {
      this.editor.execCommand("FontSize", false, size)
    },
    // 行高选项
    lineHeightSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.lineHeightSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    lineHeightSelectCompClick(size) {
      this.editor.execCommand("LineHeight", false, size)
    },
    // 列表选项
    listSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.listSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    listSelectCompClick(value) {
      this.editor.execCommand("ApplyOrderedListStyle", false, { "list-style-type": value })
    },
    // 视频
    videoSelectCompShow(e) {
      this.imageSelectCompShow(e, "1")
    },
    // 图片选项
    imageSelectCompShow(e, classify = 0) {
      this.stopPropagation()
      mediaPicker
        .show({
          allInfo: true,
          multiple: true,
          maxlength: 100,
          classify
        })
        .then((res: any) => {
          const list = []
          if (res && res.constructor === Array) {
            res.forEach((item) => list.push(item))
          } else if (res && res.constructor !== Array) {
            list.push(res)
          }
          list.forEach((item) => {
            const mediaType = item.mediaType
            const materialUrl = item.materialUrl
            let node = ""
            if (mediaType === 0) {
              // 图片
              node = `<img id="_mce_temp_rob" src="${materialUrl}" />`
            } else {
              // 视频
              node = `
              <video id="_mce_temp_rob" width="100%" controls autoplay>
                <source src="${materialUrl}" type="video/mp4">
              </video>
            `
            }
            this.editor.focus()
            this.editor.execCommand("mceInsertRawHTML", false, node)
            this.editor.selection.select(this.editor.dom.select("#_mce_temp_rob")[0])
            this.editor.selection.collapse(0)
            this.editor.dom.setAttrib("_mce_temp_rob", "id", "")
          })
        })
    },
    // 图片选项
    imageItemSelectCompShow(nodeRect) {
      this.stopPropagation()
      this.hideButtoms()
      const wrapper = this.$refs.wrapper
      const content = wrapper.querySelector(".tox-edit-area")
      if (content) {
        const rect = content.getBoundingClientRect()
        this.isClick = true
        this.selectedImage = this.editor.selection.getNode()
        this.$refs.imageItemSelectComp.show(rect.top + nodeRect.top - 54, rect.left + nodeRect.left + nodeRect.width / 2 - 206)
      }
    },
    imageItemSelectCompClick(value) {
      switch (value) {
        case "edit":
          this.$refs.imageEditComp.show(this.selectedImage.src, (url) => {
            this.selectedImage.src = url
            const outHtml = this.selectedImage.outerHTML
            this.editor.execCommand("mceReplaceContent", false, outHtml)
          })
          break
        case "center":
          this.editor.execCommand("JustifyCenter")
          break
        case "maxWidth":
          var width = this.selectedImage.style.width
          if (width === "100%") {
            this.editor.dom.setStyle(this.selectedImage, "width", "")
          } else {
            this.editor.dom.setStyle(this.selectedImage, "width", "100%")
          }
          break
        case "delete":
          this.editor.execCommand("Delete")
          break
        default:
          break
      }
    },
    // 列表选项
    linkSelectCompShow(e) {
      this.stopPropagation()
      const rect = this.getBoundingClientRect()
      if (rect) {
        this.isClick = true
        this.$refs.linkSelectComp.show(rect.top, rect.left)
        this.hideButtoms()
      }
    },
    linkSelectCompClick(value) {
      const node = `<a id="_mce_temp_rob" href="${value.href}">${value.label} </a>`
      this.editor.focus()
      this.editor.execCommand("mceInsertRawHTML", false, node)
      this.editor.selection.select(this.editor.dom.select("#_mce_temp_rob")[0])
      this.editor.selection.collapse(0)
      this.editor.dom.setAttrib("_mce_temp_rob", "id", "")
    },
    getBoundingClientRect() {
      let wrapper = this.$refs.wrapper
      let target = getToolbarTarget(wrapper)
      if (target) {
        const rect = target.getBoundingClientRect()
        return { top: rect.top + rect.height + 12, left: rect.left }
      }
    },
    hideButtoms() {
      this.buttoms.forEach((item) => {
        item.visible = false
      })
    },
    hideAllPopver() {
      this.isClick = false
    },
    stopPropagation() {
      window.event && window.event.stopPropagation()
      this.$refs.titleSelectComp.hide()
      this.$refs.colorSelectComp.hide()
      this.$refs.bgColorSelectComp.hide()
      this.$refs.fontSizeSelectComp.hide()
      this.$refs.lineHeightSelectComp.hide()
      this.$refs.listSelectComp.hide()
      this.$refs.imageItemSelectComp.hide()
    },
    close() {
      this.$emit("update:visible", false)
    },
    async confirm() {
      if (this.isLoading) return false
      let content = this.getContent()
      const div = document.createElement("div")
      div.innerHTML = content
      let imgs = div.querySelectorAll("img")
      const apis = []
      imgs.forEach((img) => {
        if (img.src.indexOf("base64") > -1) {
          apis.push(this.getPostImage(img))
        }
      })
      try {
        this.isLoading = true
        if (apis.length) {
          await Promise.all(apis)
          content = div.innerHTML
        }
        this.$emit("confirm", content)
        this.close()
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    getPostImage(img) {
      return new Promise((req, rej) => {
        const url = img.src
        const arr = url.split(",")
        const bstr = window.atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        const imgFile = new File([u8arr], guid(), { type: "image/png" })
        fetchUpFile({
          folderId: "0&mediaType=0",
          file: imgFile
        }).then((res: any) => {
          img.src = res.data.materialUrl
          req(res.data)
        })
      })
    },
    getTinymce() {
      if (window.tinymce) {
        return window.tinymce.get(this.tinymceId)
      }
    },
    getContent() {
      const it = this.getTinymce()
      if (it) {
        return it.getContent()
      }
      return this.content
    },
    setContent(val) {
      const it = this.getTinymce()
      if (it) {
        it.setContent && it.setContent(val)
      }
    },
    getFontCount() {
      var iframe = document.querySelector(`#${this.tinymceId}_ifr`) as HTMLIFrameElement
      if (iframe) {
        const doc = iframe.contentWindow.document
        doc.onclick = () => {
          this.hideAllPopver()
        }
        doc.onkeyup = (e) => {
          this.fontCount = doc.body.innerText.replaceAll("\n", "").length
          if (e.ctrlKey && e.code == "Backslash") {
            this.removeformat()
          }
        }
        this.fontCount = doc.body.innerText.replaceAll("\n", "").length
      }
    },
    removeformat(e) {
      this.editor.execCommand("RemoveFormat")
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible) {
          this.tinymceId = `vue-tinymce-${Date.now()}`
          setTimeout(() => {
            this.init()
          }, 40)
        } else {
          const it = this.getTinymce()
          if (it) it.destroy()
        }
      },
      immediate: true
    },
    content: {
      handler() {
        if (this.content) {
          this.setContent(this.content)
          this.getFontCount()
        }
      },
      immediate: true
    }
  },
  components: {
    TipWrapper,
    TitleSelectComp,
    ColorSelectComp,
    BgColorSelectComp,
    FontSizeSelectComp,
    LineHeightSelectComp,
    ListSelectComp,
    ImageItemSelectComp,
    ImageEditComp,
    LinkSelectComp
  }
})
</script>
<style lang="scss">
.tinymce-container {
  min-width: 1208px;
  height: calc(100vh - 123px);
  background-color: #f9f8f6;

  .tox-edit-area {
    background: #fff;
  }
  .svg-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 46px;
    max-width: 138px;
  }
  .svg-icon-bg {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    height: 28px;
  }
  .svg-icon-arrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    height: 28px;
  }

  .tox-tinymce {
    border: none;
  }
  .tox-tbtn {
    margin: 10px 8px !important;
    width: auto !important;
    min-width: 28px !important;
    height: 28px !important;
    line-height: 28px !important;
    border-radius: 5px;
    &.tox-tbtn--enabled,
    &.tox-tbtn--enabled:hover {
      background: #f5f5f5;
    }
  }
  .tox-editor-header {
    width: 100%;
    box-shadow: 0px 0px 10px #f0f0f0 !important;
    .tox-toolbar__primary {
      justify-content: center;
      background: none;
    }
  }
  .tox-sidebar-wrap {
    margin: 24px auto;
    width: 76%;
    box-shadow: 0px 0px 10px #f0f0f0 !important;
  }
  .tox-toolbar {
    justify-content: center;
  }
  .tox-toolbar__group {
    position: relative;
    border: none !important;
    & + .tox-toolbar__group::after {
      content: " ";
      display: block;
      position: absolute;
      top: 10px;
      left: 0;
      width: 1px;
      height: 28px;
      background-color: #eeeeee;
    }
  }
}

.tinymce-dialog {
  height: 100%;
  border-radius: 0;
  & > .el-dialog__header {
    display: none;
  }
}

.tinymce-header {
  display: flex;
  padding: 0 24px;
  width: 100%;
  height: 56px;
  justify-content: space-between;
  .tinymce-header-item {
    display: flex;
    align-items: center;
  }
  .tinymce-header-logo {
    height: 32px;
  }
  .tinymce-header-avatar {
    margin-right: 8px;
    height: 32px;
    overflow: hidden;
    border-radius: 50%;
  }
  .tinymce-header-text {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
  }
  .tinymce-header-line {
    margin: 0 10px;
    width: 1px;
    height: 28px;
    background: #cccccc;
  }
}

.tinymce-footer-fontCount {
  position: absolute;
  top: 50%;
  left: 0;
  font-size: 16px;
  font-weight: 400;
  color: #989898;
  transform: translateY(-50%);
}
.el-color-dropdown__btns {
  display: flex;
}
</style>
