import { isWx } from "./utils.js"

function QuintEaseOut(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b
}

let step = 0
let animation = true
const maxStep = 100
let target
let key
let val
let newVal
let callback

let wxRequestAnimationFrame = function (cb) {
  setTimeout(() => {
    cb()
  }, 20)
}
const animationFrame = isWx ? wxRequestAnimationFrame : requestAnimationFrame

export const setAnimationFrame = (raf) => {
  wxRequestAnimationFrame = raf
}

const loop = function (raf = animationFrame) {
  if (step >= maxStep) {
    if (animation) {
      target[key] = newVal
      callback && callback()
    }
  } else {
    const v = QuintEaseOut(step / maxStep, 0, 1, 1)
    if (animation) {
      target[key] = val + v * (newVal - val)
      callback && callback()
    }
    raf(() => {
      if (animation) {
        // 缓动小数到2位精度就关了，省性能
        if (v > 0.99) {
          return false
        }
        loop(raf)
      }
    })
    step++
  }
}

// 赶时间写的比较随意，滚动条动画
export const startAnimation = function (_target, _key, _val, _newVal, _callback) {
  setTimeout(() => {
    step = 0
    animation = true
    target = _target
    key = _key
    val = _val
    newVal = _newVal
    callback = _callback
    if (_target.canvas && _target.canvas.requestAnimationFrame) {
      loop(_target.canvas.requestAnimationFrame)
    } else {
      loop()
    }
  }, 20)
}
export const endAnimation = function () {
  animation = false
}
