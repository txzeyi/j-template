declare const window: any

export const linkSelectRegistered = function (editor: any, showCallBack: Function) {
  const key = 'linkSelect'
  editor.ui.registry.addToggleButton(key, {
    icon: key,
    tooltip: key,
    onAction: function () {
      showCallBack(editor)
    },
    onSetup: function (buttonApi: any) {
      var editorEventCallback = function (eventApi: any) {
        window.linkSelectTimer && clearTimeout(window.linkSelectTimer)
        window.linkSelectTimer = setTimeout(() => {
          let node = eventApi.element
          if (node.nodeName == 'A') {
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
