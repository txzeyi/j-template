declare const window: any

export const videoSelectRegistered = function (editor: any, showCallBack: Function) {
  const key = 'videoSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.videoSelectTimer && clearTimeout(window.videoSelectTimer)
        window.videoSelectTimer = setTimeout(() => {
          let node = eventApi.element
          if (node.nodeName == 'VIDEO') {
            const rect = node.getBoundingClientRect()
            buttonApi.setActive(true)
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
