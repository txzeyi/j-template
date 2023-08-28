import { editorData } from "../../common/globalData"
import { getRgbTo16 } from "../../common/utils"

declare const window: any

export const bgColorSelectRegistered = function (editor: any, showCallBack: Function, wrapper: HTMLElement) {
  const key = 'bgColorSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.bgClorSelectTimer && clearTimeout(window.bgClorSelectTimer)
        window.bgClorSelectTimer = setTimeout(() => {
          if (wrapper) {
            const path = wrapper.querySelector('#tinyBgColorLine')
            if (path) {
              let color = eventApi.element.style.backgroundColor || editorData.bgColor
              if (color.indexOf('rgb') > -1) {
                color = getRgbTo16(color)
              }
              editorData.bgColor = color
              path.setAttribute('fill', color || 'transparent')
            }
          }
        }, 60)
      };
      editor.on('NodeChange', editorEventCallback)
      return function () {
        editor.off('NodeChange', editorEventCallback)
      }
    },
  })
}
