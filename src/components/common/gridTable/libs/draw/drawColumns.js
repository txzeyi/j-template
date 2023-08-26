import { settingDrawFont, hasDraw, getThValue, drawIndexInterval } from "../utils.js"
import { computeSelectBox } from "./drawSelect.js"

export default function drawColumns() {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const widthHalf = cellWidth / 2
  const heightHalf = cellHeight / 2
  const columnsLength = this.columns.length

  ctx.beginPath()

  // bg
  ctx.fillStyle = style.thBgColor
  ctx.fillRect(padding, padding, cellWidth, clientHeight)

  if (this.selectItems && this.selectItems.length) {
    // 绘制选中溅射的背景颜色
    const select = computeSelectBox.call(this)
    ctx.fillStyle = style.sputteringBgColor
    ctx.fillRect(padding, padding + select.minY - this.scrollTop, cellWidth, select.maxY - select.minY)
  }

  // // border
  ctx.beginPath()
  ctx.strokeStyle = style.borderColor
  ctx.strokeRect(padding, padding, cellWidth, clientHeight)

  // text
  settingDrawFont.call(this, style.thFontColor, style.thFontSize, style.thFontWeight, style.thFontFamily)
  const { minIndexX, minIndexY, maxIndexX, maxIndexY } = drawIndexInterval.call(this)
  for (let i = 0; i < columnsLength; i++) {
    const _y = (i + 1) * cellHeight
    const item = this.columns[i]
    if (i < minIndexY) {
      continue
    }
    if (i > maxIndexY) {
      continue
    }
    if (hasDraw.call(this, this.scrollLeft, _y, cellWidth, 1)) {
      let text = getThValue(item.sph)
      if (this.on.columnsRender) {
        const t = this.on.columnsRender(item)
        if (t && typeof t === "string") {
          text = t
        }
      }
      ctx.fillText(text, widthHalf + padding, _y + heightHalf + padding - this.scrollTop)
      ctx.moveTo(padding, _y + padding - this.scrollTop)
      ctx.lineTo(padding + cellWidth, _y + padding - this.scrollTop)
    }
  }
  ctx.stroke()
}
