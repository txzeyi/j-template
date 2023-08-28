import { pxToNumber, settingDrawFont } from "../utils.js"

export const drawWrapper = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this

  // border
  ctx.strokeStyle = style.borderColor
  ctx.strokeRect(padding, padding, clientWidth, clientHeight)
}

export const drawTitle = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this

  ctx.beginPath()
  ctx.fillStyle = style.thBgColor
  ctx.strokeStyle = style.borderColor
  ctx.fillRect(padding, padding, cellWidth, cellHeight)
  ctx.strokeRect(padding, padding, cellWidth, cellHeight)
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding + cellWidth, padding + cellHeight)
  ctx.stroke()

  // 绘制文字
  const fz = pxToNumber(style.thFontSize)
  const leftRight = pxToNumber(style.titlePaddingLeftRight)
  const topBotton = pxToNumber(style.titlePaddingTopBotton)
  settingDrawFont.call(this, style.titleFontColor, style.titleFontSize, style.titleFontWeight, style.titleFontFamily)
  ctx.fillText("柱镜", cellWidth - fz - leftRight + padding, 0.5 * fz + topBotton + padding)
  ctx.fillText("球镜", leftRight + fz + padding, cellHeight - 0.5 * fz - topBotton + padding)
}

export const drawOther = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this

  // 清理边界内容
  const tp = padding * 2

  ctx.clearRect(0, 0, clientWidth + tp, padding - 1)
  ctx.clearRect(0, 0, padding - 1, clientHeight + tp)
  ctx.clearRect(clientWidth + padding + 1, 0, padding, clientHeight + tp)
  ctx.clearRect(0, clientHeight + padding + 1, clientWidth + tp, tp)
}
