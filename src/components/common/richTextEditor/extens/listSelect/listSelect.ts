import { editorData } from "../../common/globalData"

declare const window: any

export const listSelectRegistered = function (editor: any, showCallBack: Function, wrapper: HTMLElement) {
  const key = 'listSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.listSelectTimer && clearTimeout(window.listSelectTimer)
        window.listSelectTimer = setTimeout(() => {
          if (wrapper) {
            let node = eventApi.element
            if (node.nodeName == 'LI') node = node.parentElement
            let listStyleType = node.style.listStyleType || editorData.listStyleType
            editorData.listStyleType = listStyleType
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
