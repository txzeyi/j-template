// 点击元素外部触发事件
const eventHandler = (event: Event, element: HTMLElement, cb: Function) => {
  if (element.contains(event.target as Node)) {
    return
  }
  cb()
}
export const clickOutSide = {
  mounted(el: HTMLElement, binding: any) {
    const cb = binding.value // callback function
    if (typeof cb !== "function") {
      return console.warn("[clickOutside]: callback must be a function")
    }
    document.addEventListener("click", (e) => eventHandler(e, el, cb))
  },
  unmounted(el: HTMLElement, binding: any) {
    const cb = binding.value // callback function
    document.removeEventListener("click", (e) => eventHandler(e, el, cb))
  }
}
