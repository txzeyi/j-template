import { isWx, eventType, aabb, drawIndexInterval } from "../utils.js"

// 计算盒子
export const computeSelectBox = function () {
  // 获取选中的最大值和最小值
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const headersLength = this.headers.length
  const columnsLength = this.columns.length
  const headerObj = {}
  const columsObj = {}
  for (let i = 0; i < headersLength; i++) {
    headerObj[this.headers[i].cyl] = i
  }

  for (let i = 0; i < columnsLength; i++) {
    columsObj[this.columns[i].sph] = i
  }

  let minItemX = this.selectItems[0]
  let maxItemX = this.selectItems[0]
  let minItemY = this.selectItems[0]
  let maxItemY = this.selectItems[0]
  for (let i = 0; i < this.selectItems.length; i++) {
    const item = this.selectItems[i]
    const valX = Math.abs(item.cyl)
    const valY = Math.abs(item.sph)
    if (Math.abs(minItemX.cyl) > valX) {
      minItemX = item
    }
    if (Math.abs(maxItemX.cyl) < valX) {
      maxItemX = item
    }
    if (Math.abs(minItemY.sph) > valY) {
      minItemY = item
    }
    if (Math.abs(maxItemY.sph) < valY) {
      maxItemY = item
    }
  }
  const minX = (headerObj[minItemX.cyl] + 1) * cellWidth
  const maxX = (headerObj[maxItemX.cyl] + 1) * cellWidth + cellWidth
  const minY = (columsObj[minItemY.sph] + 1) * cellHeight
  const maxY = (columsObj[maxItemY.sph] + 1) * cellHeight + cellHeight
  return { minX, maxX, minY, maxY }
}

// 计算边框内容是否绘制，绘制最小，最大值
export const computeDrawBox = function (x, y, w, h) {
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const minX = cellWidth + padding
  const minY = cellHeight + padding
  const maxX = clientWidth + cellWidth + padding
  const maxY = clientHeight + cellHeight + padding
  return aabb(
    { minX, minY, maxX, maxY },
    {
      minX: x,
      minY: y,
      maxX: x + w,
      maxY: y + h
    }
  )
}

// 绘制选中小方块
export const drawBlock = function (x, y, size) {
  const bp = size / 2
  this.ctx.fillRect(x - bp, y - bp, size, size)
  this.ctx.moveTo(x - bp, y - bp)
  this.ctx.lineTo(x + bp, y - bp)
  this.ctx.lineTo(x + bp, y + bp)
  this.ctx.lineTo(x - bp, y + bp)
  this.ctx.lineTo(x - bp, y - bp)
}

// 选中的边框
export const drawSelectBorder = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this

  if (this.selectItems && this.selectItems.length) {
    ctx.beginPath()
    const select = computeSelectBox.call(this)
    const x = padding + select.minX - this.scrollLeft
    const y = padding + select.minY - this.scrollTop
    const w = select.maxX - select.minX
    const h = select.maxY - select.minY

    ctx.lineWidth = 2
    ctx.strokeStyle = style.borderActiveColor
    // 大方块
    if (this.selectState === "headers") {
      const box = computeDrawBox.call(this, x, padding, w, clientHeight)
      if (box) {
        const _x = Math.max(x, cellWidth + padding)
        const _w = Math.min(w, x + w - _x)
        this.ctx.moveTo(_x, padding)
        this.ctx.lineTo(_x + _w, padding)
        this.ctx.lineTo(_x + _w, clientHeight + padding)
        this.ctx.lineTo(_x, clientHeight + padding)
        _x == x && this.ctx.lineTo(_x, padding)
        ctx.stroke()
      }
    } else if (this.selectState === "columns") {
      const box = computeDrawBox.call(this, padding, y, clientWidth, h)
      if (box) {
        const _y = Math.max(y, cellHeight + padding)
        const _h = Math.min(h, y + h - _y)
        if (_y == y) {
          this.ctx.moveTo(padding, _y)
          this.ctx.lineTo(clientWidth + padding, _y)
        } else {
          this.ctx.moveTo(clientWidth + padding, _y)
        }
        this.ctx.lineTo(clientWidth + padding, _y + _h)
        this.ctx.lineTo(padding, _y + _h)
        this.ctx.lineTo(padding, _y)
        ctx.stroke()
      }
    } else if (this.selectState === "cell") {
      const box = computeDrawBox.call(this, x, y, w, h)
      if (box) {
        const _x = Math.max(x, cellWidth + padding)
        const _y = Math.max(y, cellHeight + padding)
        const _w = Math.min(w, x + w - _x)
        const _h = Math.min(h, y + h - _y)
        if (_y == y) {
          this.ctx.moveTo(_x, _y)
          this.ctx.lineTo(_x + _w, _y)
        } else {
          this.ctx.moveTo(_x + _w, _y)
        }
        this.ctx.lineTo(_x + _w, _y + _h)
        this.ctx.lineTo(_x, _y + _h)
        _x == x && this.ctx.lineTo(_x, _y)
        ctx.stroke()
      }
    } else if (this.selectState === "title") {
      this.ctx.moveTo(padding, padding)
      this.ctx.lineTo(padding + clientWidth, padding)
      this.ctx.lineTo(padding + clientWidth, padding + clientHeight)
      this.ctx.lineTo(padding, padding + clientHeight)
      this.ctx.lineTo(padding, padding)
      ctx.stroke()
    }

    ctx.lineWidth = 1
  }
}

// 拖拽点
export const drawSelectPoint = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this

  if (this.selectItems && this.selectItems.length) {
    ctx.beginPath()
    const select = computeSelectBox.call(this)
    const x = padding + select.minX - this.scrollLeft
    const y = padding + select.minY - this.scrollTop
    const w = select.maxX - select.minX
    const h = select.maxY - select.minY

    ctx.lineWidth = 2
    ctx.strokeStyle = style.borderActiveColor

    // 移动端需要小方块
    if (isWx || eventType.hasTouch || this.selectState === "headers" || this.selectState === "columns") {
      ctx.beginPath()
      const size = 10
      ctx.fillStyle = "#FFFFFF"
      const minX = cellWidth + padding
      const minY = cellHeight + padding
      const maxX = clientWidth + padding
      const maxY = clientHeight + padding
      const bww = clientWidth / 2 + padding
      const bwh = clientHeight / 2 + padding
      if (this.selectState === "headers") {
        // left
        if (x <= minX && x >= minX - size) {
          ctx.globalAlpha = (1 - (minX - x) / size).toFixed(1)
          drawBlock.call(this, x, bwh, size)
          ctx.stroke()
        } else if (x > minX && x < maxX) {
          ctx.globalAlpha = 1
          drawBlock.call(this, x, bwh, size)
          ctx.stroke()
        } else if (x > maxX && x < maxX + size) {
          ctx.globalAlpha = (1 - (x - maxX) / size).toFixed(1)
          drawBlock.call(this, x, bwh, size)
          ctx.stroke()
        }

        // right
        const x2 = x + w
        if (x2 <= minX && x2 >= minX - size) {
          ctx.beginPath()
          ctx.globalAlpha = (1 - (minX - x2) / size).toFixed(1)
          drawBlock.call(this, x2, bwh, size)
          ctx.stroke()
        } else if (x2 > minX && x2 < maxX) {
          ctx.beginPath()
          ctx.globalAlpha = 1
          drawBlock.call(this, x2, bwh, size)
          ctx.stroke()
        } else if (x2 > maxX && x2 < maxX + size) {
          ctx.beginPath()
          ctx.globalAlpha = (1 - (x2 - maxX) / size).toFixed(1)
          drawBlock.call(this, x2, bwh, size)
          ctx.stroke()
        }
      } else if (this.selectState === "columns") {
        // left
        if (y <= minY && y >= minY - size) {
          ctx.globalAlpha = (1 - (minY - y) / size).toFixed(1)
          drawBlock.call(this, bww, y, size)
          ctx.stroke()
        } else if (y > minY && y < maxY) {
          ctx.globalAlpha = 1
          drawBlock.call(this, bww, y, size)
          ctx.stroke()
        } else if (y > maxY && y < maxY + size) {
          ctx.globalAlpha = (1 - (y - maxY) / size).toFixed(1)
          drawBlock.call(this, bww, y, size)
          ctx.stroke()
        }

        // right
        const y2 = y + h
        if (y2 <= minY && y2 >= minY - size) {
          ctx.beginPath()
          ctx.globalAlpha = (1 - (minY - y2) / size).toFixed(1)
          drawBlock.call(this, bww, y2, size)
          ctx.stroke()
        } else if (y2 > minY && y2 < maxY) {
          ctx.beginPath()
          ctx.globalAlpha = 1
          drawBlock.call(this, bww, y2, size)
          ctx.stroke()
        } else if (y2 > maxY && y2 < maxY + size) {
          ctx.beginPath()
          ctx.globalAlpha = (1 - (y2 - maxY) / size).toFixed(1)
          drawBlock.call(this, bww, y2, size)
          ctx.stroke()
        }
      } else if (this.selectState === "cell") {
        // left
        let alphaX = 1,
          alphaY = 1,
          drawX = false,
          drawY = false
        if (x <= minX && x >= minX - size) {
          drawX = true
          alphaX = (1 - (minX - x) / size).toFixed(1)
        } else if (x > minX && x < maxX) {
          drawX = true
          alphaX = 1
        } else if (x > maxX && x < maxX + size) {
          alphaX = (1 - (x - maxX) / size).toFixed(1)
          drawX = true
        }

        if (y <= minY && y >= minY - size) {
          alphaY = (1 - (minY - y) / size).toFixed(1)
          drawY = true
        } else if (y > minY && y < maxY) {
          alphaY = 1
          drawY = true
        } else if (y > maxY && y < maxY + size) {
          alphaY = (1 - (y - maxY) / size).toFixed(1)
          drawY = true
        }

        if (drawX && drawY) {
          ctx.globalAlpha = Math.min(alphaX, alphaY)
          drawBlock.call(this, x, y, size)
          ctx.stroke()
        }

        // right
        ;(alphaX = 1), (alphaY = 1), (drawX = false), (drawY = false)
        const x2 = x + w
        const y2 = y + h
        if (x2 <= minX && x2 >= minX - size) {
          alphaX = (1 - (minX - x2) / size).toFixed(1)
          drawX = true
        } else if (x2 > minX && x2 < maxX) {
          alphaX = 1
          drawX = true
        } else if (x2 > maxX && x2 < maxX + size) {
          alphaX = (1 - (x2 - maxX) / size).toFixed(1)
          drawX = true
        }

        if (y2 <= minY && y2 >= minY - size) {
          alphaY = (1 - (minY - y2) / size).toFixed(1)
          drawY = true
        } else if (y2 > minY && y2 < maxY) {
          alphaY = 1
          drawY = true
        } else if (y2 > maxY && y2 < maxY + size) {
          alphaY = (1 - (y2 - maxY) / size).toFixed(1)
          drawY = true
        }
        if (drawX && drawY) {
          ctx.beginPath()
          ctx.globalAlpha = Math.min(alphaX, alphaY)
          drawBlock.call(this, x2, y2, size)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    ctx.lineWidth = 1
  }
}
