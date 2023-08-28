import { computeSelectBox } from "./draw/drawSelect.js"
import { allSelect, copy, move, paste } from "./extension/index.js"
import { endAnimation, startAnimation } from "./scroll.js"
import { aabb, aabbX, aabbY, eventType, getCanvas, getThValue, isWx, setCursor, setHasTouch } from "./utils.js"

export const handleEvent = function () {
  return {
    name: "canvasEvents",
    handleEvent: (event) => {
      // eslint-disable-next-line default-case
      switch (event.type) {
        case "mousedown":
        case "touchstart":
          this.onTouchStart(event)
          break
        case "touchmove":
        case "mousemove":
          this.onTouchMove(event)
          break
        case "touchend":
        case "mouseup":
        case "touchcancel":
        case "mousecancel":
          this.onTouchEnd(event)
          break
        case "paste":
          onPaste.call(this, event)
          break
        case "keydown":
          // if (!this.hasActiveInput()) {
          //   return false
          // }
          onKeydown.call(this, event)
          break
        case "wheel":
          onWheel.call(this, event)
          this.emit("scroll", this.selectItems)
          break
      }
    }
  }
}

export const addEvent = function (el, type, func) {
  return el.addEventListener(type, func, { passive: false })
}

export const removeEvent = function (el, type, func) {
  return el.removeEventListener(type, func)
}

export const handleDOMEvents = function (eventOperation) {
  eventOperation(this.canvas, "touchstart", this.eventObj)
  eventOperation(document, "touchmove", this.eventObj)
  eventOperation(document, "touchcancel", this.eventObj)
  eventOperation(document, "touchend", this.eventObj)

  eventOperation(this.canvas, "mousedown", this.eventObj)
  eventOperation(document, "mousemove", this.eventObj)
  eventOperation(document, "mouseup", this.eventObj)
  eventOperation(document, "mousecancel", this.eventObj)
  eventOperation(document, "keydown", this.eventObj)
  eventOperation(document, "paste", this.eventObj)
  eventOperation(document, "wheel", this.eventObj)
}

export const touchData = function (e) {
  let touche = {}
  if (isWx) {
    touche = {
      x: e.changedTouches[0].x,
      y: e.changedTouches[0].y
    }
  } else if (e.changedTouches) {
    setHasTouch(true)
    touche = {
      x: e.changedTouches[0].clientX - this.canvasNodeRect.x,
      y: e.changedTouches[0].clientY - this.canvasNodeRect.y
    }
  } else {
    setHasTouch(false)
    touche = {
      x: e.clientX - this.canvasNodeRect.x,
      y: e.clientY - this.canvasNodeRect.y
    }
  }
  return touche
}

let eventId = 0
export const onTouchStart = function (e) {
  e.preventDefault && e.preventDefault()
  this.followTimer && clearTimeout(this.followTimer)
  endAnimation()
  // getCanvas 是异步
  eventId++
  this.eventId = eventId
  this.isActive = false
  getCanvas(this).then((res) => {
    this.canvasNodeRect = { x: res.x, y: res.y }
    this.dist = { x: 0, y: 0 }
    this.startPos = touchData.call(this, e)
    this.movePos = { ...this.startPos }
    this.dragPos = {
      x: this.startPos.x + this.scrollLeft,
      y: this.startPos.y + this.scrollTop
    }
    this.timestamp = Date.now()
    this.intersectObject = intersectObjects.call(this)
    // 鼠标端
    if (!(isWx || eventType.hasTouch)) {
      setTypeState.call(this)
    }
    this.isTap = true
    this.isActive = true
    // 异步带来的事件不一致，touchstart逻辑比touchend 晚执行，肯定不行啦
    if (eventId !== this.eventId) {
      onTouchEnd.call(this, e, false)
    }
  })
}

export const debounce = function (args, callBack) {
  if (this.debounceBreak) {
    this.debounceCb = callBack
    this.debounceCbArgs = args
    return false
  }
  this.debounceBreak = true
  callBack.call(this, args)
  setTimeout(() => {
    this.debounceBreak = false
    if (this.debounceCb) {
      this.debounceCb.call(this, this.debounceCbArgs)
      this.debounceCb = null
      this.debounceCbArgs = null
    }
  }, 40)
}

export const onTouchMove = function (e) {
  endAnimation()
  debounce.call(this, e, onTouchMoveEvent)
  //   onTouchMoveEvent.call(this, e)
}

export const onTouchMoveEvent = function (e) {
  this.followTimer && clearTimeout(this.followTimer)
  if (this.isActive) {
    e.preventDefault && e.preventDefault()
    if (this.intersectObject) {
      const pos = touchData.call(this, e)
      const dist = { x: this.movePos.x - pos.x, y: this.movePos.y - pos.y }
      const timestamp = Date.now()
      if (timestamp - this.timestamp > 300) {
        this.timestamp = timestamp
      }
      this.movePos = { ...pos }
      this.dist = dist
      // 触摸端
      if (isWx || eventType.hasTouch) {
        if (this.intersectObject.point) {
          dragMoveUpdate.call(this)
          this.update()
        } else {
          this.setScroll(this.scrollLeft + dist.x, this.scrollTop + dist.y)
          this.update()
        }
        this.isTap = Math.abs(pos.x - this.startPos.x) + Math.abs(pos.y - this.startPos.y) < 16
      } else {
        // 鼠标端
        if (this.intersectObject.scrollLeft) {
          this.setScroll(this.scrollLeft - dist.x / this.scrollXRate, this.scrollTop)
          this.update()
        } else if (this.intersectObject.scrollTop) {
          this.setScroll(this.scrollLeft, this.scrollTop - dist.y / this.scrollYRate)
          this.update()
        } else {
          dragMoveUpdate.call(this)
          this.update()
        }
      }
    }
  }
  const pos = touchData.call(this, e)
  const intersectObject = intersectObjects.call(this, pos)
  this.emit("cellHover", { pos, items: intersectObject.items, type: intersectObject.type })
}

export const onTouchEnd = function (e) {
  eventId++
  if (this.isActive && this.intersectObject) {
    const isPc = !(isWx || eventType.hasTouch)
    if (this.isTap || isPc) {
      setTypeState.call(this)
      this.update()
    } else {
      // 触摸端
      if (isWx || eventType.hasTouch) {
        if (this.intersectObject.type !== "point") {
          // 快速滑动
          const timestamp = Date.now()
          const duration = timestamp - this.timestamp
          if (duration < 200) {
            const absDistX = Math.abs(this.dist.x)
            const absDistY = Math.abs(this.dist.y)
            if (absDistX > absDistY) {
              const speed = (10 * absDistX) / duration
              const newX = (speed * this.clientWidth) / 3.6
              startAnimation(this, "scrollLeft", this.scrollLeft, this.scrollLeft + (newX * this.dist.x) / absDistX, () => {
                this.setScroll(this.scrollLeft, this.scrollTop)
                this.update()
              })
            } else if (absDistY > 0 && absDistX < absDistY) {
              const speed = (10 * absDistY) / duration
              const newY = (speed * this.clientHeight) / 3.6
              startAnimation(this, "scrollTop", this.scrollTop, this.scrollTop + (newY * this.dist.y) / absDistY, () => {
                this.setScroll(this.scrollLeft, this.scrollTop)
                this.update()
              })
            }
          }
        }
      }
    }
  }
  this.isActive = false
  setCursor.call(this, "default")
  if (this.intersectObject) {
    this.intersectObject.scrollLeft = false
    this.intersectObject.scrollTop = false
  }
  emitEvent.call(this)
}

export const intersectObjects = function (restPos) {
  const pos = restPos || this.startPos
  const xIndex = Math.floor((this.scrollLeft + pos.x - this.padding) / this.cellWidth) - 1
  const yIndex = Math.floor((this.scrollTop + pos.y - this.padding) / this.cellHeight) - 1

  // 检查是否命中-边距
  if (pos.x < this.padding || pos.x > this.clientWidth + this.padding || pos.y > this.clientHeight + this.padding || pos.y < this.padding) {
    return { type: "null", items: [] }
  }

  const cellWidth = this.cellWidth + this.padding
  const cellHeight = this.cellHeight + this.padding
  if (!restPos && this.selectState !== "null" && this.selectItems && this.selectItems.length) {
    const pointSize = 20
    const middleX = this.clientWidth / 2 + this.padding
    const middleY = this.clientHeight / 2 + this.padding
    const absPos = {
      x: pos.x + this.scrollLeft,
      y: pos.y + this.scrollTop
    }

    const select = computeSelectBox.call(this)
    const bw = cellWidth / 2
    const bh = cellHeight / 2
    // 触摸端
    if (this.selectState === "headers") {
      // 头部选中状态
      if (Math.abs(select.minX + this.padding - absPos.x) <= pointSize && Math.abs(middleY + this.padding - pos.y) <= pointSize) {
        this.dragPos.x = select.maxX + this.padding - bw
        return { type: "headers", point: true, items: this.intersectObject.items }
      }
      if (Math.abs(select.maxX + this.padding - absPos.x) <= pointSize && Math.abs(middleY + this.padding - pos.y) <= pointSize) {
        this.dragPos.x = select.minX + this.padding + bw
        return { type: "headers", point: true, items: this.intersectObject.items }
      }
    } else if (this.selectState === "columns") {
      // 列选中状态
      if (Math.abs(middleX + this.padding - pos.x) <= pointSize && Math.abs(select.minY + this.padding - absPos.y) <= pointSize) {
        this.dragPos.y = select.maxY + this.padding - bh
        return { type: "columns", point: true, items: this.intersectObject.items }
      }
      if (Math.abs(middleX + this.padding - pos.x) <= pointSize && Math.abs(select.maxY + this.padding - absPos.y) <= pointSize) {
        this.dragPos.y = select.minY + this.padding + bh
        return { type: "columns", point: true, items: this.intersectObject.items }
      }
    }
    if (isWx || eventType.hasTouch) {
      // cell单元格
      if (Math.abs(select.minX + this.padding - absPos.x) <= pointSize && Math.abs(select.minY + this.padding - absPos.y) <= pointSize) {
        this.dragPos.x = select.maxX + this.padding - bw
        this.dragPos.y = select.maxY + this.padding - bh
        return { type: "cell", point: true, items: this.intersectObject.items }
      }
      if (Math.abs(select.maxX + this.padding - absPos.x) <= pointSize && Math.abs(select.maxY + this.padding - absPos.y) <= pointSize) {
        this.dragPos.x = select.minX + this.padding + bw
        this.dragPos.y = select.minY + this.padding + bh
        return { type: "cell", point: true, items: this.intersectObject.items }
      }
    }
  }

  // 鼠标端
  if (!(isWx || eventType.hasTouch)) {
    // 检查是否命中-滚动条left
    if (this.scrollMaxX) {
      const isInBotton = pos.y >= this.clientHeight + this.padding - this.scrollSize
      const ratioX = this.scrollLeft / this.scrollMaxX
      const ratioWidth = 1 - (this.scrollMaxX - this.clientWidth) / this.scrollMaxX
      const width = ratioWidth * this.clientWidth + this.padding + this.scrollSize
      const left = ratioX * (this.clientWidth - width - this.padding) + this.padding
      if (pos.x >= left && pos.x < left + width && isInBotton) {
        setCursor.call(this, "pointer")
        return { ...this.intersectObject, scrollLeft: true }
      }
    }

    // 检查是否命中-滚动条top
    if (this.scrollMaxY) {
      const isInRight = pos.x >= this.clientWidth + this.padding - this.scrollSize
      const ratioY = this.scrollTop / this.scrollMaxY
      const ratioHeight = 1 - (this.scrollMaxY - this.clientHeight) / this.scrollMaxY
      const height = ratioHeight * this.clientHeight + this.padding + this.scrollSize
      const top = ratioY * (this.clientHeight - height - this.padding) + this.padding
      if (pos.y >= top && pos.y < top + height && isInRight) {
        setCursor.call(this, "pointer")
        return { ...this.intersectObject, scrollTop: true }
      }
    }
  }

  // 检查是否命中-单元格
  if (pos.x > cellWidth && pos.y > cellHeight) {
    if (xIndex > -1 && yIndex > -1) {
      if (this.headers[xIndex] && this.columns[yIndex]) {
        const key = `${getThValue(this.headers[xIndex].cyl)}${getThValue(this.columns[yIndex].sph)}`
        if (this.dataMap[key]) {
          return { type: "cell", items: [this.dataMap[key]] }
        }
      }
    }
    return { type: "null", items: [] }
  }

  // 检查是否命中-表头
  if (pos.x > cellWidth && pos.y < cellHeight) {
    return { type: "headers", items: this.headers[xIndex] ? this.headers[xIndex].items : [] }
  }

  // 检查是否命中-表列
  if (pos.x < cellWidth && pos.y > cellHeight) {
    return { type: "columns", items: this.columns[yIndex] ? this.columns[yIndex].items : [] }
  }

  // 检查是否命中-标题
  if (pos.x <= cellWidth && pos.y <= cellHeight) {
    return { type: "title", items: this.quadrantData }
  }

  return { type: "null", items: [] }
}

export const dragMoveUpdate = function () {
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const moveDragPos = {
    x: this.movePos.x + this.scrollLeft,
    y: this.movePos.y + this.scrollTop
  }
  const box = {
    minX: Math.min(this.dragPos.x, moveDragPos.x),
    minY: Math.min(this.dragPos.y, moveDragPos.y),
    maxX: Math.max(this.dragPos.x, moveDragPos.x),
    maxY: Math.max(this.dragPos.y, moveDragPos.y)
  }
  const hl = this.headers.length
  const cl = this.columns.length
  const selectItems = []
  const push = (hIndex, cIndex) => {
    if (this.headers[hIndex] && this.columns[cIndex]) {
      const key = `${getThValue(this.headers[hIndex].cyl)}${getThValue(this.columns[cIndex].sph)}`
      const item = this.dataMap[key]
      if (item) {
        selectItems.push(item)
      }
    }
  }
  for (let i = 0; i < hl * cl; i++) {
    const headerIndex = i % hl
    const columnIndex = Math.floor(i / hl)
    const minX = padding + cellWidth + headerIndex * cellWidth
    const minY = padding + cellHeight + columnIndex * cellHeight
    const item = { minX, minY, maxX: minX + cellWidth, maxY: minY + cellHeight }
    if (this.selectState === "headers") {
      if (aabbX(item, box)) {
        push(headerIndex, columnIndex)
      }
    } else if (this.selectState === "columns") {
      if (aabbY(item, box)) {
        push(headerIndex, columnIndex)
      }
    } else if (this.selectState === "cell") {
      if (aabb(item, box)) {
        push(headerIndex, columnIndex)
      }
    } else if (this.selectState === "title") {
      push(headerIndex, columnIndex)
    }
  }
  this.selectItems = selectItems
  this.intersectObject.items = selectItems
  autoFollow.call(this) // 是否到边界，跟随移动
  emitEvent.call(this)
}

export const autoFollow = function () {
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const dist = { x: this.movePos.x - this.startPos.x, y: this.movePos.y - this.startPos.y }
  let speedX = 0
  let speedY = 0
  if (this.movePos.x <= cellWidth + padding && dist.x < 0) {
    speedX = -8
  }
  if (this.movePos.y <= cellHeight + padding && dist.y < 0) {
    speedY = -8
  }
  if (this.movePos.x >= clientWidth - cellWidth - padding && dist.x > 0) {
    speedX = 8
  }
  if (this.movePos.y >= clientHeight - cellHeight - padding && dist.y > 0) {
    speedY = 8
  }
  if (speedX || speedY) {
    this.followTimer = setTimeout(() => {
      if (!this.isActive) {
        return false
      }
      this.setScroll(this.scrollLeft + speedX, this.scrollTop + speedY)
      dragMoveUpdate.call(this, this.movePos)
      this.update()
    }, 17)
  }
}

export const getMouseMoveLocation = function () {
  const cellWidth = this.cellWidth + this.padding
  const cellHeight = this.cellHeight + this.padding
  const absPos = {
    x: this.startPos.x + this.scrollLeft,
    y: this.startPos.y + this.scrollTop
  }
  if (this.selectItems && this.selectItems.length) {
    const select = computeSelectBox.call(this)
    const bw = cellWidth / 2
    const bh = cellHeight / 2
    // 鼠标端
    if (this.selectState === "headers") {
      // 头部选中状态
      if (select.minX + this.padding < absPos.x && select.maxX + this.padding > absPos.x) {
        if (select.minX + this.padding + bw > absPos.x) {
          this.dragPos.x = select.maxX + this.padding - bw
        } else {
          this.dragPos.x = select.minX + this.padding + bw
        }
        return { type: "headers", point: true, items: this.intersectObject.items }
      }
    } else if (this.selectState === "columns") {
      // 列选中状态
      if (select.minY + this.padding < absPos.x && select.maxY + this.padding > absPos.x) {
        if (select.minY + this.padding + bh > absPos.y) {
          this.dragPos.y = select.maxY + this.padding - bh
        } else {
          this.dragPos.y = select.minY + this.padding + bh
        }
        return { type: "columns", point: true, items: this.intersectObject.items }
      }
    } else {
      // cell单元格
      if (
        select.minX + this.padding < absPos.x &&
        select.maxX + this.padding > absPos.x &&
        select.minY + this.padding < absPos.y &&
        select.maxY + this.padding > absPos.y
      ) {
        if (select.minX + this.padding + bw > absPos.x) {
          this.dragPos.x = select.maxX + this.padding - bw
        } else {
          this.dragPos.x = select.minX + this.padding + bw
        }
        if (select.minY + this.padding + bh > absPos.y) {
          this.dragPos.y = select.maxY + this.padding - bh
        } else {
          this.dragPos.y = select.minY + this.padding + bh
        }
        return { type: "cell", point: true, items: this.intersectObject.items }
      }
    }
  }
}

export const setTypeState = function () {
  switch (this.intersectObject.type) {
    case "headers":
      this.selectState = "headers"
      this.selectItems = this.intersectObject.items
      break
    case "columns":
      this.selectState = "columns"
      this.selectItems = this.intersectObject.items
      break
    case "cell":
      this.selectState = "cell"
      this.selectItems = this.intersectObject.items
      break
    case "title":
      this.selectState = "title"
      this.selectItems = this.intersectObject.items
      break
    default:
      this.selectItems = []
      this.selectState = "null"
  }
}

export const emitEvent = function () {
  if (this.intersectObject) {
    switch (this.intersectObject.type) {
      case "headers":
        this.emit("headersSelect", this.selectItems)
        break
      case "columns":
        this.emit("columnsSelect", this.selectItems)
        break
      case "cell":
        this.emit("cellSelect", this.selectItems)
        break
      case "title":
        this.emit("titleSelect", this.selectItems)
        break
      default:
    }
  }
}

// 按键
const onKeydown = function (e) {
  switch (e.code) {
    case "ArrowRight":
    case "ArrowLeft":
    case "ArrowUp":
    case "ArrowDown":
      move.call(this, e)
      emitEvent.call(this)
      break
    case "KeyA":
      if (e.ctrlKey) {
        allSelect.call(this)
      }
      break
    case "KeyC":
      if (e.ctrlKey) {
        const hasCopy = copy.call(this)
        if (hasCopy) {
          this.on.copy && this.on.copy()
        }
      }
      break
    case "KeyV":
      // 占位置
      break
    default:
      onkeyUp.call(this, e)
      break
  }
}

export const onPaste = function (e) {
  const clipboardData = e.clipboardData || window.clipboardData
  paste.call(this, clipboardData.getData("text"))
}

export const onWheel = function (e) {
  if (e.target === this.canvas) {
    e.preventDefault()
    let direction = 0
    if (e.wheelDelta) {
      direction = e.wheelDelta > 0 ? 1 : -1
    }
    if (e.detail) {
      direction = e.detail > 0 ? -1 : 1
    }
    if (direction > 0) {
      // 内容向上 滚轮向上滑动
      this.setScroll(this.scrollLeft, this.scrollTop - 40)
      this.update()
    } else if (direction < 0) {
      // 内容向下 滚轮向下滑动
      this.setScroll(this.scrollLeft, this.scrollTop + 40)
      this.update()
    }
  }
}

export const onkeyUp = function (e) {
  const selectItems = this.getSetItem()
  if (selectItems.length) {
    e.preventDefault && e.preventDefault()
  }
  if (!this.canNumberInput) {
    return false
  }
  const oldSelectItems = JSON.parse(JSON.stringify(selectItems))
  if (selectItems && selectItems.length) {
    const inputs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
    const isReset = this.lastSelectId !== this.eventId
    if (inputs.includes(e.key)) {
      const val = e.key
      selectItems.forEach((item) => {
        let text = item[this.inputType] || ""
        const hasDecimal = String(text).indexOf(".") > -1
        // 已经有了.就不需要了
        if (this.inputType === "price" && e.key === "." && hasDecimal) {
          return false
        }
        if (this.inputType === "price" && e.key === "." && !hasDecimal) {
          this.lastInputHasDecimal = true
        }
        if (isReset) {
          item[this.inputType] = val
          this.lastInputHasDecimal = false
        } else {
          if (!hasDecimal && this.lastInputHasDecimal && this.inputType === "price") {
            text = text ? `${text}.` : `0.`
          }
          if (text) {
            item[this.inputType] = `${text}${val}`
          } else {
            item[this.inputType] = val
          }
        }
      })
    } else if (e.key === "Delete") {
      for (let i = 0; i < selectItems.length; i++) {
        var item = selectItems[i]
        item[this.inputType] = ""
        this.lastInputHasDecimal = false
      }
    } else if (e.key === "Backspace") {
      for (let i = 0; i < selectItems.length; i++) {
        var item = selectItems[i]
        const oldStr = String(item[this.inputType])
        const val = oldStr.substr(0, oldStr.length - 1)
        item[this.inputType] = val
        if (val === 0 || isNaN(Number(val))) {
          item[this.inputType] = ""
        }
      }
      this.lastInputHasDecimal = false
    }
    this.on.valueChange && this.on.valueChange(selectItems, oldSelectItems)
    this.update()
  }
  this.lastSelectId = this.eventId
}
