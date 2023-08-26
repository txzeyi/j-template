declare const window: any

export const imageSelectRegistered = function (editor: any, showCallBack: Function, itemShowCallBack: Function, wrapper: HTMLElement) {
  const key = 'imageSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.imageSelectTimer && clearTimeout(window.imageSelectTimer)
        window.imageSelectTimer = setTimeout(() => {
          let node = eventApi.element
          if (node.nodeName == 'IMG') {
            const rect = node.getBoundingClientRect()
            buttonApi.setActive(true)
            itemShowCallBack(rect)
          } else {
            buttonApi.setActive(false)
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
