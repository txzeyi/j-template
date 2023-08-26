import type { Directive } from "vue"

/** 自动获取焦点 */
export const autoFocus: Directive = {
  mounted(el: any, binding: any) {
    if (binding.value == true || binding.value == undefined) {
      nextTick(() => {
        setTimeout(() => el.getElementsByTagName("input")[0]?.focus(), 100)
      })
    }
    // console.log("autoFocus:", el.children[0], binding)
  }
}
