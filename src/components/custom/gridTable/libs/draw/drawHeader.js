import { settingDrawFont, hasDraw, getThValue, drawIndexInterval } from "../utils.js"
import { computeSelectBox } from "./drawSelect.js"

export default function drawHeader() {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const widthHalf = cellWidth / 2
  const heightHalf = cellHeight / 2
  const headersLength = this.headers.length

  ctx.beginPath()

  // bg
  ctx.fillStyle = style.thBgColor
  ctx.fillRect(padding, padding, clientWidth, cellHeight)

  if (this.selectItems && this.selectItems.length) {
    // 绘制选中溅射的背景颜色
    const select = computeSelectBox.call(this)
    ctx.fillStyle = style.sputteringBgColor
    ctx.fillRect(padding + select.minX - this.scrollLeft, padding, select.maxX - select.minX, cellHeight)
  }

  // border
  ctx.strokeStyle = style.borderColor
  ctx.strokeRect(padding, padding, clientWidth, cellHeight)

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
      let text = getThValue(item.cyl)
      if (this.on.headersRender) {
        const t = this.on.headersRender(item)
        if (t && typeof t === "string") {
          text = t
        }
      }
      ctx.fillText(text, _x + widthHalf + padding - this.scrollLeft, heightHalf + padding)
      ctx.moveTo(_x + padding - this.scrollLeft, padding)
      ctx.lineTo(_x + padding - this.scrollLeft, clientHeight + padding)
    }
  }
  ctx.stroke()
}
