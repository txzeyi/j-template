import { Directive } from "vue"

export const resize: Directive = {
  mounted(el, binding) {
    let width = "",
      height = ""
    function get() {
      const style = document.defaultView.getComputedStyle(el)
      if (width !== style.width || height !== style.height) {
        binding?.value({ width, height })
      }
      width = style.width
      height = style.height
    }

    el.__vueReize__ = setInterval(get, 200)
  },
  unmounted(el) {
    clearInterval(el.__vueReize__)
  }
}
