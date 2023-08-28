export default () => {
  const cutdown = ref(60)
  const timer = ref<number | null>(null)
  const startCutdown = (cb: Promise<any>) => {
    if (timer.value) {
      return clearInterval(timer.value)
    }
    cb.then(() => {
      timer.value = window.setInterval(() => {
        cutdown.value--
        if (cutdown.value === 0) {
          clearInterval(Number(timer.value))
          timer.value = null
          cutdown.value = 60
        }
      }, 1000)
    })
  }

  const resetTimer = () => {
    clearInterval(timer.value)
    timer.value = null
    cutdown.value = 60
  }
  return {
    cutdown,
    timer,
    startCutdown,
    resetTimer
  }
}
