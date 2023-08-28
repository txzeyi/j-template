import { editorData } from "../../common/globalData"
import { getRgbTo16 } from "../../common/utils"

declare const window: any

export const colorSelectRegistered = function (editor: any, showCallBack: Function, wrapper: HTMLElement) {
  const key = 'colorSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.colorSelectTimer && clearTimeout(window.colorSelectTimer)
        window.colorSelectTimer = setTimeout(() => {
        if (wrapper) {
            const path = wrapper.querySelector('#tinyColorLine')
            if (path) {
              let color = eventApi.element.style.color
              if (color.indexOf('rgb') > -1) {
                color = getRgbTo16(color)
              }
              editorData.color = color
              path.setAttribute('fill', color)
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
