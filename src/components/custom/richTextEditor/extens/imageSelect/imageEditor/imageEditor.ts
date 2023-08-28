interface Rect {
  x: number,
  y: number,
  w: number,
  h: number,
  img?: HTMLImageElement | null
  imgWidth?: number
  imgHeight?: number
}

export default class ImageEditor {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  maxHeight: number
  imageRect: any
  editorRect: Rect
  layers: Rect[]
  model: number
  padding: number
  markCanvas: HTMLCanvasElement
  markCtx: CanvasRenderingContext2D
  outputCanvas: HTMLCanvasElement
  outputCtx: CanvasRenderingContext2D
  isTouch?: boolean
  movePos: Rect
  intersecter: any
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.width = canvas.width
    this.height = canvas.height
    this.maxHeight = canvas.height
    // 图片
    this.imageRect = {
      x: 0, y: 0,
      w: this.width,
      h: this.height,
      img: null
    }
    // 裁剪框
    this.editorRect = {
      x: 30,
      y: 30,
      w: this.width - 60,
      h: this.height - 60
    }
    this.movePos = {
      x: 0,
      y: 0,
      w: this.width,
      h: this.height
    }
    this.layers = []
    this.model = -1 // 0裁剪 1标注 2文字
    this.padding = 4
    // 遮障
    this.markCanvas = document.createElement('canvas')
    this.markCtx = this.markCanvas.getContext('2d') as CanvasRenderingContext2D
    // 输出
    this.outputCanvas = document.createElement('canvas')
    this.outputCtx = this.outputCanvas.getContext('2d') as CanvasRenderingContext2D

    this.createCanvas()
    this.initEvent()
  }

  createCanvas() {
    const canvass = [this.canvas, this.markCanvas, this.outputCanvas]
    canvass.forEach(canvas => {
      if (canvas) {
        canvas.width = this.width
        canvas.height = this.height
        canvas.style.width = `${this.width}px`
        canvas.style.height = `${this.height}px`
      }
    })
  }

  initEvent() {
    this.canvas.addEventListener('mousedown', this.mousedown.bind(this))
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this))
    this.canvas.addEventListener('mouseup', this.mouseup.bind(this))
    this.canvas.addEventListener('mousewheel', this.mousewheel.bind(this))
  }
  destroy() {
    this.canvas.removeEventListener('mousedown', this.mousedown)
    this.canvas.removeEventListener('mousemove', this.mousemove)
    this.canvas.removeEventListener('mouseup', this.mouseup)
    this.canvas.removeEventListener('mousewheel', this.mousewheel)
  }
  mousedown(e: any) {
    if (this.model === -1) return false
    this.isTouch = true
    this.movePos = this.getPos({ x: e.pageX, y: e.pageY })
    this.intersecter = null
  }
  mousemove(e: any) {
    if (this.isTouch) {
      const movePos = this.getPos({ x: e.pageX, y: e.pageY })
      if (this.intersecter === null) this.intersecter = this.getIntersecter(movePos)
      if (this.intersecter.type === 'image') {
        this.imageRect.x += movePos.x - this.movePos.x
        this.imageRect.y += movePos.y - this.movePos.y
      } else if (
        this.intersecter.type === 'top-left' ||
        this.intersecter.type === 'top-right' ||
        this.intersecter.type === 'bottom-left' ||
        this.intersecter.type === 'bottom-right'
      ) {
        const { fixedPoint, target } = this.intersecter
        target.x = Math.min(movePos.x, fixedPoint.x)
        target.y = Math.min(movePos.y, fixedPoint.y)
        target.w = Math.abs(movePos.x - fixedPoint.x)
        target.h = Math.abs(movePos.y - fixedPoint.y)
      } else if (this.intersecter.type === 'content') {
        this.editorRect.x += movePos.x - this.movePos.x
        this.editorRect.y += movePos.y - this.movePos.y
      }
      this.movePos = movePos
      this.update()
    }
  }
  mouseup(e: any) {
    this.isTouch = false
    this.intersecter = null
  }
  mousewheel(e: any) {
    if (this.model !== 0) return false
    e.stopPropagation();
    e.preventDefault()
    let scale = 0
    if (e.wheelDelta) {//IE/Opera/Chrome
      if (e.wheelDelta > 0) {
        scale = 0.02 //向上滚动事件
      } else {
        scale = -0.02 //向下滚动事件
      }
    } else if (e.detail) {//Firefox
      if (e.detail < 0) {
        scale = 0.02 //向上滚动事件
      } else {
        scale = -0.02 //向下滚动事件
      }
    }
    const mousePos = this.getPos({ x: e.pageX, y: e.pageY })
    this.imageRect.x = this.imageRect.x - (mousePos.x - this.imageRect.x) * scale
    this.imageRect.y = this.imageRect.y - (mousePos.y - this.imageRect.y) * scale
    this.imageRect.w = this.imageRect.w + this.imageRect.w * scale
    this.imageRect.h = this.imageRect.h + this.imageRect.h * scale
    this.update()
  }
  getPos(pos: any) {
    const rect = this.canvas.getBoundingClientRect()
    return { x: pos.x - rect.x, y: pos.y - rect.y, w: 0, h: 0 }
  }
  update() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.save()
    if (this.imageRect.img) {
      this.ctx.drawImage(this.imageRect.img, this.imageRect.x, this.imageRect.y, this.imageRect.w, this.imageRect.h)
    }
    if (this.model == 0) {
      // 0裁剪
      this.getMark(this.editorRect)
      this.ctx.drawImage(this.markCanvas, 0, 0, this.width, this.height)
      this.drawPoint(this.editorRect, true)
    }
  }
  output() {
    this.outputCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height)
    if (this.imageRect.img) {
      const pl = this.imageRect.imgWidth / this.width
      this.outputCanvas.width = this.editorRect.w * pl
      this.outputCanvas.height = this.editorRect.h * pl
      this.outputCanvas.style.width = `${this.outputCanvas.width}px`
      this.outputCanvas.style.height = `${this.outputCanvas.height}px`
      this.outputCtx.drawImage(
        this.imageRect.img,
        (this.imageRect.x - this.editorRect.x) * pl,
        (this.imageRect.y - this.editorRect.y) * pl,
        this.imageRect.w * pl,
        this.imageRect.h * pl
      )
      return this.outputCanvas.toDataURL('image/png', 1)
    }
  }
  getIntersecter(pos: any) {
    const data: any = {}
    const { x, y, w, h } = this.editorRect
    data.type = this.getIntersectePoint(pos, this.editorRect)
    switch (data.type) {
      case 'top-left':
        data.fixedPoint = { x: x + w, y: y + h }
        break
      case 'top-right':
        data.fixedPoint = { x: x, y: y + h }
        break
      case 'bottom-left':
        data.fixedPoint = { x: x + w, y: y }
        break
      case 'bottom-right':
        data.fixedPoint = { x: x, y: y }
        break
      default:
        break;
    }
    data.target = this.editorRect
    return data
  }
  getIntersectePoint(pos: Rect, rect: Rect) {
    const r = 5
    if (Math.abs(pos.x - rect.x) <= r && Math.abs(pos.y - rect.y) <= r) return 'top-left'
    if (Math.abs(pos.x - (rect.x + rect.w)) <= r && Math.abs(pos.y - rect.y) <= r) return 'top-right'
    if (Math.abs(pos.x - rect.x) <= r && Math.abs(pos.y - (rect.h + rect.y)) <= r) return 'bottom-left'
    if (Math.abs(pos.x - (rect.x + rect.w)) <= r && Math.abs(pos.y - (rect.y + rect.h)) <= r) return 'bottom-right'
    if (pos.x > rect.x && pos.x < (rect.x + rect.w) && pos.y > rect.y && pos.y < (rect.y + rect.h)) return 'content'
    return 'image'
  }
  roundRect(ctx: CanvasRenderingContext2D, rect: Rect, radius: number) {
    let { x, y, w, h } = rect
    let r = radius
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }
  getMark(rect: Rect) {
    const { x, y, w, h } = rect
    this.markCtx.clearRect(0, 0, this.width, this.height)
    this.markCtx.fillStyle = 'rgba(0, 0, 0, 0.48)'
    this.markCtx.fillRect(0, 0, this.width, this.height)
    this.markCtx.clearRect(x, y, w, h)
  }
  drawPoint(rect: Rect, isDrawBorder: boolean) {
    const { x, y, w, h } = rect
    // top-left top-right bottom-left bottom-right
    const arrs = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ]
    this.ctx.lineWidth = 3
    if (isDrawBorder) {
      this.ctx.strokeStyle = '#FF8909'
      this.ctx.beginPath()
      this.ctx.moveTo(arrs[0][0], arrs[0][1])
      this.ctx.lineTo(arrs[1][0], arrs[1][1])
      this.ctx.lineTo(arrs[3][0], arrs[3][1])
      this.ctx.lineTo(arrs[2][0], arrs[2][1])
      this.ctx.closePath()
      this.ctx.stroke()
    }
    arrs.forEach(arr => {
      this.ctx.fillStyle = '#fff'
      this.ctx.beginPath()
      this.ctx.arc(arr[0], arr[1], 5, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.strokeStyle = '#FF8909'
      this.ctx.beginPath()
      this.ctx.arc(arr[0], arr[1], 5, 0, 2 * Math.PI)
      this.ctx.stroke()
    })
  }
  setValue(url: string) {
    const img = new Image()
    img.src = url
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      this.imageRect.x = 0
      this.imageRect.y = 0
      this.imageRect.imgWidth = img.width
      this.imageRect.imgHeight = img.height
      this.imageRect.w = this.width
      this.imageRect.h = (img.height * this.width / img.width)
      this.height = this.imageRect.h
      // if (this.maxHeight < this.imageRect.h) {
      //   this.height = this.maxHeight
      // } else {
      //   this.height = this.imageRect.h
      // }
      this.imageRect.img = img
      this.editorRect = {
        x: 30,
        y: 30,
        w: this.width - 60,
        h: this.height - 60
      }
      this.createCanvas()
      this.update()
    }
  }
}
