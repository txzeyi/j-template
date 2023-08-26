import drawCell from "./draw/drawCell.js"
import drawColumns from "./draw/drawColumns.js"
import drawHeader from "./draw/drawHeader.js"
import { drawOther, drawTitle, drawWrapper } from "./draw/drawOther.js"
import { drawScroll } from "./draw/drawScroll.js"
import { drawSelectBorder, drawSelectPoint } from "./draw/drawSelect.js"
import { drawSummary, drawSummaryTitle } from "./draw/drawSummary.js"
import { addEvent, handleDOMEvents, handleEvent, onTouchEnd, onTouchMove, onTouchStart, removeEvent } from "./event.js"
import { optionsInit } from "./optionInit.js"
import { getCanvas, getThValue, isWx, pxToNumber, setCanvasPixelRatio } from "./utils.js"
import { setAnimationFrame } from "./scroll.js"

export default class GridTable {
  constructor(options, wxScope) {
    this.el = options.el
    this.quadrant = { AA: [], AB: [], BA: [], BB: [] } // cyl	柱镜光度值  sph	球镜光度值
    this.scope = wxScope
    getCanvas(this, this.scope).then((res) => {
      const opt = optionsInit(options)
      this.canvas = res.node
      this.canvasNodeRect = { x: res.x, y: res.y }
      this.optionWidth = res.width
      this.optionHeight = res.height
      this.clientWidth = res.width
      this.clientHeight = res.height
      this.canvas.ctx = this.ctx = this.canvas.getContext("2d")
      this.data = opt.data
      this.on = opt.on
      this.render = opt.render
      this.style = opt.style
      this.validate = opt.validate
      this.resize = opt.resize
      this.quadrantType = opt.quadrantType
      this.showSummary = opt.showSummary
      this.canNumberInput = opt.canNumberInput
      this.padding = pxToNumber(opt.style.padding) + 0.5
      this.inputType = opt.inputType || "number"
      this.selectId = 0 // 区别是否选中内容有没变化
      if (isWx) {
        setAnimationFrame(this.canvas.requestAnimationFrame)
      }

      this.getClientData()
      this.getQuadrantData()
      this.getClientOptions()
      this.setRatio()
      this.bindEvent()
      this.update()
    })
  }
  isInitialize(cb, isFirst = false) {
    if (this.canvas) {
      if (!isFirst) {
        cb()
      }
      return true
    }
    // 还在获取canvas，你们就调这个函数了
    setTimeout(() => this.isInitialize(cb), 100)
    return false
  }
  setData(data) {
    if (
      !this.isInitialize(() => {
        this.setData(data)
      }, true)
    ) {
      return false
    }
    this.data = data
    this.getClientData()
    this.getQuadrantData()
    this.getClientOptions()
    this.setRatio()
    this.update()
  }
  setRect(rect) {
    if (!this.canvas) {
      return false
    }
    if (rect.width) {
      this.optionWidth = rect.width
      this.clientWidth = rect.width
    }
    if (rect.height) {
      this.optionHeight = rect.height
      this.clientHeight = rect.height
    }
    if (rect.x && rect.y) {
      this.canvasNodeRect = { x: rect.x, y: rect.y }
    }
    this.getClientOptions()
    this.setRatio()
    this.update()
  }
  getSetItem() {
    return this.selectItems.filter((item) => !item.disabled)
  }
  getClientData() {
    this.dataMap = {}
    this.quadrant = { AA: [], AB: [], BA: [], BB: [] } // cyl	柱镜光度值  sph	球镜光度值
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i]
      const key = `${getThValue(item.cyl)}${getThValue(item.sph)}`
      if (item.cyl > 0 && item.sph > 0) {
        this.quadrant.AA.push(item)
      } else if (item.cyl > 0 && item.sph < 0) {
        this.quadrant.AB.push(item)
      } else if (item.cyl < 0 && item.sph > 0) {
        this.quadrant.BA.push(item)
      } else if (item.cyl < 0 && item.sph < 0) {
        this.quadrant.BB.push(item)
      } else if (item.cyl === 0 && item.sph === 0) {
        this.quadrant.AA.push(item)
        this.quadrant.AB.push(item)
        this.quadrant.BA.push(item)
        this.quadrant.BB.push(item)
      } else if (item.cyl === 0 && item.sph > 0) {
        this.quadrant.AA.push(item)
        this.quadrant.BA.push(item)
      } else if (item.cyl === 0 && item.sph < 0) {
        this.quadrant.AB.push(item)
        this.quadrant.BB.push(item)
      } else if (item.cyl > 0 && item.sph === 0) {
        this.quadrant.AA.push(item)
        this.quadrant.AB.push(item)
      } else if (item.cyl < 0 && item.sph === 0) {
        this.quadrant.BA.push(item)
        this.quadrant.BB.push(item)
      }
      this.dataMap[key] = item
    }
  }
  getClientOptions() {
    if (!this.style) {
      return false
    }
    this.cellWidth = pxToNumber(this.style.cellWidth)
    this.cellHeight = pxToNumber(this.style.cellHeight)
    this.pointSize = pxToNumber(this.style.pointSize)
    this.width = ((this.headers.length + 1) * this.cellWidth) << 0
    this.height = ((this.columns.length + 1) * this.cellHeight) << 0
    this.clientWidth = Math.min(this.optionWidth - this.padding * 2, this.width)
    this.clientHeight = Math.min(this.optionHeight - this.padding * 2, this.showSummary ? this.height + this.cellHeight : this.height)

    // 滚动参数
    this.scrollSize = pxToNumber(this.style.scrollSize)
    this.scrollTop = 0 // 滚动值
    this.scrollLeft = 0 // 滚动值
    this.scrollMinX = 0
    this.scrollMaxX = Math.max(this.width - this.clientWidth, 0) << 0
    this.scrollMinY = 0
    this.scrollMaxY = Math.max(this.height - this.clientHeight, 0) << 0
    this.scrollXRate = (this.clientWidth - this.padding * 2) / this.width
    this.scrollYRate = this.clientHeight / this.height
    if (this.showSummary) {
      // 合计
      this.scrollMaxY = Math.max(this.height - this.clientHeight + this.cellHeight, 0) << 0
    }
  }
  getQuadrantData() {
    // cyl	柱镜光度值  sph	球镜光度值
    let quadrantData = []
    if (this.quadrantType == 1) {
      quadrantData = this.quadrant.BA
    } else if (this.quadrantType == 2) {
      quadrantData = this.quadrant.AB
    } else if (this.quadrantType == 3) {
      quadrantData = this.quadrant.AA
    } else {
      quadrantData = this.quadrant.BB
    }
    const headersMap = {}
    const columnsMap = {}
    for (let i = 0; i < quadrantData.length; i++) {
      const item = quadrantData[i]
      if (!headersMap[item.cyl]) {
        headersMap[item.cyl] = []
      }
      if (!columnsMap[item.sph]) {
        columnsMap[item.sph] = []
      }
      headersMap[item.cyl].push(item)
      columnsMap[item.sph].push(item)
    }
    this.headers = Object.keys(headersMap)
      .map((key) => ({
        cyl: key,
        items: headersMap[key].sort((a, b) => Math.abs(a.sph) - Math.abs(b.sph))
      }))
      .sort((a, b) => Math.abs(a.cyl) - Math.abs(b.cyl))
    this.columns = Object.keys(columnsMap)
      .map((key) => ({
        sph: key,
        items: columnsMap[key].sort((a, b) => Math.abs(a.cyl) - Math.abs(b.cyl))
      }))
      .sort((a, b) => Math.abs(a.sph) - Math.abs(b.sph))
    this.quadrantData = quadrantData
    this.selectItems = []
    this.selectState = "null"
  }
  quadrantTypeChange(val) {
    if (!this.canvas) {
      return false
    }
    this.quadrantType = val
    this.getQuadrantData()
    this.refresh()
  }
  refresh() {
    getCanvas(this, this.scope).then((res) => {
      this.canvasNodeRect = { x: res.x, y: res.y }
      this.getClientOptions()
      this.setRatio()
      this.update()
    })
  }
  setRatio() {
    setCanvasPixelRatio(this.canvas, this.clientWidth + this.padding * 2, this.clientHeight + this.padding * 2, false)
  }
  bindEvent() {
    if (!isWx) {
      this.eventObj = handleEvent.call(this)
      handleDOMEvents.call(this, addEvent)
    } else {
      console.info(`
      wx 需要额外绑定事件，执行实例onTouchStart、onTouchMove、onTouchEnd
      <canvas
        id="app"
        type="2d"
        style="width:375px;height:667px;"
        bindtouchstart="onTouchStart"
        bindtouchmove="onTouchMove"
        bindtouchend="onTouchEnd"
        bindtouchcancel="onTouchEnd"
      ></canvas>
      `)
    }
  }
  onTouchStart(e) {
    onTouchStart.call(this, e)
  }
  onTouchMove(e) {
    onTouchMove.call(this, e)
  }
  onTouchEnd(e) {
    onTouchEnd.call(this, e)
  }
  hasActiveInput() {
    if (isWx) {
      return true
    }
    return !!document.querySelector("input:focus")
  }
  setScroll(x, y) {
    this.scrollLeft = Math.min(Math.max(x, this.scrollMinX), this.scrollMaxX)
    this.scrollTop = Math.min(Math.max(y, this.scrollMinY), this.scrollMaxY)
  }
  emit(funcName, ...rest) {
    if (this.on && this.on[funcName]) {
      this.on[funcName].apply(this.on[funcName], rest)
    }
  }
  setInputType(key) {
    this.inputType = key
    this.update()
  }
  update() {
    if (!this.canvas) {
      return false
    }
    const d = new Date()
    const W = this.clientWidth + this.padding * 2
    const H = this.clientHeight + this.padding * 2
    this.canvas.ctx.clearRect(0, 0, W, H)
    if (this.data.length === 0) {
      return false
    }
    drawWrapper.apply(this)
    drawCell.apply(this)
    drawHeader.apply(this)
    this.showSummary && drawSummary.apply(this)
    drawColumns.apply(this)
    this.showSummary && drawSummaryTitle.apply(this)
    drawTitle.apply(this)
    drawScroll.apply(this)
    drawSelectBorder.apply(this)
    drawOther.apply(this)
    drawSelectPoint.apply(this)

    if (new Date() - d > 16) {
      // console.log(`绘制时间: ${new Date() - d}ms`);
    }
    console.log(`绘制时间: ${new Date() - d}ms`)
  }
  destroy() {
    const W = this.clientWidth + this.padding * 2
    const H = this.clientHeight + this.padding * 2
    this.canvas.ctx.clearRect(0, 0, W, H)
    if (!isWx) {
      handleDOMEvents.call(this, removeEvent)
    }
  }
}
