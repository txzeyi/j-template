import { settingDrawFont, hasDraw, getThValue, drawIndexInterval } from "../utils.js"
import { computeSelectBox } from "./drawSelect.js"

export default function drawCell() {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const widthHalf = cellWidth / 2
  const heightHalf = cellHeight / 2
  const headersLength = this.headers.length
  const columnsLength = this.columns.length
  ctx.beginPath()

  if (this.selectItems && this.selectItems.length) {
    // 绘制选中溅射的背景颜色
    const select = computeSelectBox.call(this)
    ctx.fillStyle = style.sputteringBgColor
    ctx.fillRect(padding + select.minX - this.scrollLeft, padding - this.scrollTop, select.maxX - select.minX, select.maxY)
    ctx.fillRect(padding - this.scrollLeft, padding + select.minY - this.scrollTop, select.minX, select.maxY - select.minY)

    // 绘制选中的背景颜色
    ctx.fillStyle = style.selectBgColor
    ctx.fillRect(
      padding + select.minX - this.scrollLeft,
      padding + select.minY - this.scrollTop,
      select.maxX - select.minX,
      select.maxY - select.minY
    )
  }

  // text
  settingDrawFont.call(this, style.tdFontColor, style.tdFontSize, style.tdFontWeight, style.tdFontFamily)
  const { minIndexX, minIndexY, maxIndexX, maxIndexY } = drawIndexInterval.call(this)
  for (let i = 0; i < headersLength * columnsLength; i++) {
    const headerIndex = i % headersLength
    const columnIndex = Math.floor(i / headersLength)
    const _x = cellWidth + headerIndex * cellWidth
    const _y = cellHeight + columnIndex * cellHeight
    if (headerIndex < minIndexX) {
      continue
    }
    if (headerIndex > maxIndexX) {
      continue
    }
    if (columnIndex < minIndexY) {
      continue
    }
    if (columnIndex > maxIndexY) {
      continue
    }
    const key = `${getThValue(this.headers[headerIndex].cyl)}${getThValue(this.columns[columnIndex].sph)}`
    const item = this.dataMap[key]
    if (hasDraw.call(this, _x, _y, cellWidth, cellHeight)) {
      if (item) {
        let text = item[this.inputType] || ""
        if (["0", undefined].includes(text)) {
          text = ""
        }
        let hasCustomColor = null
        let hasCustomBgColor = null
        if (this.on.cellRender) {
          const t = this.on.cellRender(item)
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
        if (item.disabled || item.isDisable) {
          hasCustomBgColor = style.disabledBgColor
        }
        if (hasCustomBgColor) {
          ctx.fillStyle = hasCustomBgColor
          const dx = _x + padding - this.scrollLeft
          const dy = _y + padding - this.scrollTop
          ctx.fillRect(dx, dy, cellWidth, cellHeight)
        }
        if (text) {
          if (hasCustomColor) {
            ctx.fillStyle = hasCustomColor
            ctx.fillText(text, _x + widthHalf + padding - this.scrollLeft, _y + heightHalf + padding - this.scrollTop)
            settingDrawFont.call(this, style.tdFontColor, style.tdFontSize, style.tdFontWeight, style.tdFontFamily)
          } else {
            settingDrawFont.call(this, style.tdFontColor, style.tdFontSize, style.tdFontWeight, style.tdFontFamily)
            ctx.fillText(text, _x + widthHalf + padding - this.scrollLeft, _y + heightHalf + padding - this.scrollTop)
          }
        }
      } else {
        ctx.stroke()
        ctx.beginPath()
        ctx.fillStyle = style.disabledBgColor
        const dx = _x + padding - this.scrollLeft
        const dy = _y + padding - this.scrollTop
        ctx.fillRect(dx, dy, cellWidth, cellHeight)
        ctx.moveTo(dx, dy)
        ctx.lineTo(dx + cellWidth, dy + cellHeight)
        ctx.strokeStyle = style.disabledLine
        ctx.stroke()
        ctx.beginPath()
        settingDrawFont.call(this, style.tdFontColor, style.tdFontSize, style.tdFontWeight, style.tdFontFamily)
      }
      ctx.moveTo(padding, _y + padding - this.scrollTop)
      ctx.lineTo(padding + clientWidth, _y + padding - this.scrollTop)
    }
  }

  // border
  ctx.strokeStyle = style.borderColor
  ctx.stroke()
}
