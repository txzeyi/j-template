import { editorData } from "../../common/globalData"

declare const window: any

export const lineHeightSelectRegistered = function (editor: any, showCallBack: Function, wrapper: HTMLElement) {
  const key = 'lineHeightSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.lineHeightSelectTimer && clearTimeout(window.lineHeightSelectTimer)
        window.lineHeightSelectTimer = setTimeout(() => {
          if (wrapper) {
            let lineHeight = eventApi.element.style.lineHeight
            editorData.lineHeight = lineHeight
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
