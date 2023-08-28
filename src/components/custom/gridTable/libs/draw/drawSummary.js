import { settingDrawFont, hasDraw, getThValue, drawIndexInterval, add } from "../utils.js"
import { computeSelectBox } from "./drawSelect.js"

export const drawSummaryTitle = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const widthHalf = cellWidth / 2
  const heightHalf = cellHeight / 2
  ctx.beginPath()
  // bg
  ctx.fillStyle = style.thBgColor
  ctx.fillRect(padding, clientHeight + padding - cellHeight, cellWidth + 1, cellHeight + 1)

  // border
  ctx.strokeStyle = style.borderColor
  ctx.strokeRect(padding, clientHeight + padding - cellHeight, cellWidth, cellHeight)

  settingDrawFont.call(this, style.titleFontColor, style.titleFontSize, style.titleFontWeight, style.titleFontFamily)
  ctx.fillText("合计", widthHalf + padding, clientHeight + padding - heightHalf)
}

export const drawSummary = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const widthHalf = cellWidth / 2
  const heightHalf = cellHeight / 2
  const headersLength = this.headers.length
  ctx.beginPath()

  // bg
  ctx.fillStyle = style.tdBgColor
  ctx.fillRect(padding, clientHeight + padding - cellHeight, clientWidth, cellHeight)

  // border
  ctx.strokeStyle = style.borderColor
  ctx.strokeRect(padding, clientHeight + padding - cellHeight, clientWidth, cellHeight)

  // text
  settingDrawFont.call(this, style.thFontColor, style.thFontSize, style.thFontWeight, style.thFontFamily)
  const { minIndexX, minIndexY, maxIndexX, maxIndexY } = drawIndexInterval.call(this)
  for (let i = 0; i < headersLength; i++) {
    const _x = (i + 1) * cellWidth
    const item = this.headers[i]
    if (i < minIndexX) {
      continue
    }
    if (i > maxIndexX) {
      continue
    }
    if (hasDraw.call(this, _x, this.scrollTop, 1, cellHeight)) {
      let text = 0
      let hasCustomColor = null
      let hasCustomBgColor = null
      item.items.forEach((it) => {
        text = add(text, it[this.inputType])
      })
      if (this.on.summaryRender) {
        const t = this.on.summaryRender(item)
        if (t !== undefined || t !== null) {
          if (typeof t === "object") {
            text = t.text || text
            if (t.color) {
              hasCustomColor = t.color
            }
            if (t.bgColor) {
              hasCustomBgColor = t.bgColor
            }
          } else {
            text = t || text
          }
        }
      }
      if (String(text).indexOf(".") > -1) {
        const _text = Number(text)
        if (!isNaN(text)) {
          text = _text.toFixed(2)
        }
      }
      if (hasCustomBgColor) {
        ctx.fillStyle = hasCustomBgColor
        const dx = _x + padding - this.scrollLeft
        const dy = _y + padding - this.scrollTop
        ctx.fillRect(dx, dy, cellWidth, cellHeight)
      }
      if (hasCustomColor) {
        ctx.fillStyle = hasCustomColor
        ctx.fillText(text, _x + widthHalf + padding - this.scrollLeft, clientHeight - heightHalf + padding)
        settingDrawFont.call(this, style.thFontColor, style.thFontSize, style.thFontWeight, style.thFontFamily)
      } else {
        ctx.fillText(text, _x + widthHalf + padding - this.scrollLeft, clientHeight - heightHalf + padding)
      }
      ctx.moveTo(_x + padding - this.scrollLeft, padding)
      ctx.lineTo(_x + padding - this.scrollLeft, clientHeight + padding)
    }
  }
  ctx.stroke()
}
