import TipPopover from '../components/tip-popover.vue'
import { h, render } from "vue"

declare const window: any

interface TipPopoverMessageParams {
  top: number
  left: number
  title: string
}

const titlePopoverWrapper = document.createElement('div')
document.body.appendChild(titlePopoverWrapper)
export const TipPopoverMessage = function (props: TipPopoverMessageParams) {
  const app = h(TipPopover, { ...props, visible: false }) as any
  const mountNode = document.createElement('div')
  render(app, mountNode)
  const vnode = app.component
  setTimeout(() => {
    vnode.props.visible = true
  }, 100)
  titlePopoverWrapper.appendChild(mountNode)
  return {
    show: () => {
      vnode.props.visible = true
    },
    hide: () => {
      vnode.props.visible = false
    },
    destroy: () => {
      vnode.props.visible = false
      setTimeout(() => {
        render(null, mountNode)
        titlePopoverWrapper.removeChild(mountNode)
      }, 1000)
    }
  }
}

export const getToolbarTitlePoper = function (title: string) {
  switch (title) {
    case 'bgColorSelect':
      return '背景颜色'
    case 'colorSelect':
      return '字体颜色'
    case 'fontSizeSelect':
      return '字体大小'
    case 'imageEdit':
      return '图片'
    case 'lineHeightSelect':
      return '行高'
    case 'linkEdit':
      return '链接'
    case 'listSelect':
      return '列表'
    case 'titleSelect':
      return '标题'
    case 'Undo':
      return '撤销'
    case 'Redo':
      return '重做'
    case 'Italic':
      return '斜体'
    case 'Bold':
      return '粗体'
    case 'Clear formatting':
      return '清除格式'
    case 'Format Painter':
      return '格式刷'
    case 'Horizontal line':
      return '分割线'
    case 'Align left':
      return '居左对齐'
    case 'Align center':
      return '居中'
    case 'Align right':
    return '居右对齐'
    case 'Page break':
      return '换页符'
    default:
      return ''
  }
}

export const getToolbarTarget = function (wrapper: HTMLElement) {
  let target = window.event.target
  let isNext = true
  while (isNext) {
    if (target) {
      if (target.nodeName == "BUTTON" || target == wrapper) {
        isNext = false
      } else {
        target = target.parentElement
      }
    } else {
      isNext = false
    }
  }
  if (target && target.nodeName == "BUTTON") {
    return target
  }
  return null
}

// 十六进制转RGB
export const get16ToRgb = function (str: string) {
  var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if (!reg.test(str)) { return; }
  let newStr = (str.toLowerCase()).replace(/\#/g, '')
  let len = newStr.length;
  if (len == 3) {
    let t = ''
    for (var i = 0; i < len; i++) {
      t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
    }
    newStr = t
  }
  let arr = []; //将字符串分隔，两个两个的分隔
  for (var i = 0; i < 6; i = i + 2) {
    let s = newStr.slice(i, i + 2)
    arr.push(parseInt("0x" + s))
  }
  return 'rgb(' + arr.join(",") + ')'
}

// RGB转十六进制
export const getRgbTo16 = function (str: string) {
  let reg = /^(rgb|RGB)/;
  if (!reg.test(str)) { return; }
  var arr = str.slice(4, str.length - 1).split(",")
  let color = '#';
  for (var i = 0; i < arr.length; i++) {
    var t = Number(arr[i]).toString(16)
    if (t.length == 1) {   //如果为“0”的话，需要补0操作,否则只有5位数
      t = '0' + t
    }
    color += t;
  }
  return color
}
