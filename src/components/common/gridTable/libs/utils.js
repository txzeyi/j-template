let _isWx = true
try {
  wx.createSelectorQuery
} catch (error) {
  _isWx = false
}
export const eventType = {
  hasTouch: _isWx || "ontouchstart" in window
}

export const setHasTouch = (v) => {
  eventType.hasTouch = v
}

export const isWx = _isWx

// 获取缩放比例
export const getPixelRatio = function () {
  if (_isWx) {
    return wx.getSystemInfoSync().pixelRatio
  }
  return window.devicePixelRatio || 1
}

// 创建canvas
export const getCanvas = function (instance, wxScope) {
  const el = instance.el
  const resize = instance.resize
  return new Promise((resolve, reject) => {
    if (_isWx) {
      if (instance.canvas && resize === false) {
        resolve({
          node: instance.canvas,
          x: instance.canvasNodeRect.x, // 节点的上边界坐标
          y: instance.canvasNodeRect.y, // 节点的上边界坐标
          width: instance.optionWidth, // 节点的宽度
          height: instance.optionHeight // 节点的高度
        })
        return false
      }
      const query = wxScope ? wxScope.createSelectorQuery() : wx.createSelectorQuery().in(this)
      const sl = query.select(el)
      console.log(sl)
      sl.fields({ node: true, size: true }).exec((res) => {
        console.log(res, el, sl)
        sl.boundingClientRect((rect) => {
          resolve({
            node: res[0].node,
            x: rect.left, // 节点的上边界坐标
            y: rect.top, // 节点的上边界坐标
            width: rect.width, // 节点的宽度
            height: rect.height // 节点的高度
          })
        }).exec()
      })
    } else {
      let canvas = typeof el === "string" ? document.querySelector(el) : el
      // taro对canvas再次进行了封装，
      if (canvas && canvas.tagName.toLocaleLowerCase() != "canvas") {
        canvas = canvas.querySelector("canvas")
      }
      if (!canvas) {
        console.error('检查el是否正确，<canvas id="app"></canvas> el为#app')
      }
      const rect = canvas.getBoundingClientRect()

      resolve({
        node: canvas,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      })
    }
  })
}

// 设置canvas
export const setCanvasPixelRatio = function (canvas, width, height) {
  const ratio = getPixelRatio()
  const ctx = canvas.getContext("2d")
  if (_isWx) {
    if (canvas._canvasRef) {
      canvas._width = `${width << 0}px`
      canvas._height = `${height << 0}px`
    }
  } else {
    canvas.style.width = `${width << 0}px`
    canvas.style.height = `${height << 0}px`
  }
  canvas.width = (width * ratio) << 0
  canvas.height = (height * ratio) << 0
  ctx.scale(ratio, ratio) // 清晰化
  canvas.ctx = ctx
}

// px转数字
export const pxToNumber = (e) => {
  if (typeof e === "number") {
    return e
  }
  return Number(e.replace("px", ""))
}

// 获取头部文案
export const getThValue = (val) => {
  if (val === undefined) {
    return "Null"
  }
  if (typeof val === "string") {
    val = Number(val)
  }
  if (isNaN(val)) {
    return "0.00"
  }
  if (val > 0) {
    return `+${val.toFixed(2)}`
  }
  if (val < 0) {
    return `${val.toFixed(2)}`
  }
  return "0.00"
}

export const aabbX = function (box1, box2) {
  const x1 = box1.minX >= box2.minX && box1.minX < box2.maxX
  const x2 = box2.minX >= box1.minX && box2.minX < box1.maxX
  return x1 || x2
}
export const aabbY = function (box1, box2) {
  const y1 = box1.minY >= box2.minY && box1.minY < box2.maxY
  const y2 = box2.minY >= box1.minY && box2.minY < box1.maxY
  return y1 || y2
}
export const aabb = function (box1, box2) {
  return aabbX(box1, box2) && aabbY(box1, box2)
}

// 绘制文字
export const settingDrawFont = function (color, size, weight = "normal", family = "Microsoft YaHei") {
  this.ctx.textBaseline = "middle"
  this.ctx.textAlign = "center"
  this.ctx.font = `${weight} ${size} ${family}`
  this.ctx.fillStyle = color
}

// 是否在可视范围内
export const hasDraw = function (x, y, width, height) {
  return aabb(
    {
      minX: this.scrollLeft,
      minY: this.scrollTop,
      maxX: this.scrollLeft + this.clientWidth,
      maxY: this.scrollTop + this.clientHeight
    },
    {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height
    }
  )
}

// 是否在可视范围内 索引值
export const drawIndexInterval = function () {
  const minIndexX = Math.floor(this.scrollLeft / this.cellWidth)
  const minIndexY = Math.floor(this.scrollTop / this.cellHeight)
  const maxIndexX = Math.floor((this.scrollLeft + this.clientWidth) / this.cellWidth)
  const maxIndexY = Math.floor((this.scrollTop + this.clientHeight) / this.cellHeight)
  return { minIndexX, minIndexY, maxIndexX, maxIndexY }
}

// 范围取值
export const interval = (min, max, v) => Math.min(Math.max(min, v), max)

export const setCursor = function (type) {
  if (!isWx) {
    this.canvas.style.cursor = type
  }
}

export const add = function (v1, v2) {
  if (typeof v2 === "string") {
    v2 = Number(v2)
  }
  if (isNaN(v2)) {
    return v1
  }
  return v1 + v2
}
