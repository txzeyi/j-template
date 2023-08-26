import { editorData } from "../../common/globalData"
import { getRgbTo16 } from "../../common/utils"

declare const window: any

export const fontSizeSelectRegistered = function (editor: any, showCallBack: Function, wrapper: HTMLElement) {
  const key = 'fontSizeSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.fontSizeSelectTimer && clearTimeout(window.fontSizeSelectTimer)
        window.fontSizeSelectTimer = setTimeout(() => {
          if (wrapper) {
            const div = wrapper.querySelector('#tinyFontSize')
            if (div) {
              let fontSize = eventApi.element.style.fontSize
              if (!fontSize) fontSize = getComputedStyle(eventApi.element).fontSize
              editorData.fontSize = fontSize
              div.innerHTML = fontSize
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
