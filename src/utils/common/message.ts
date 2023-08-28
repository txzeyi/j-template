/**
 * 全局确认弹窗
 * @param msg 弹窗信息
 * @param options 配置信息（el官方的配置，也可加自己的配置，在内部判断用于增加功能）
 */
export const confirm = (message: string, options: anyObj = {}, subBtn?: string) => {
  const html = `<p class='text-center py-30px'>${message}</p>`
  return ElMessageBox.confirm(html, "", {
    autofocus: false,
    showClose: false,
    center: true,
    customClass: `j-messageBox ${options.showClose ? "j-message-box-show-header" : ""}`,
    dangerouslyUseHTMLString: true,
    confirmButtonClass: "w-24 ",
    cancelButtonClass: "w-24 ",
    confirmButtonText: subBtn || "确定",
    cancelButtonText: "取消",
    ...options
  })
}
