// 绘制滚动条
export const drawScroll = function () {
  const ctx = this.canvas.ctx
  const style = this.style
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
  const { scrollLeft, scrollTop, scrollMaxX, scrollMaxY, scrollSize } = this
  const r = scrollSize / 2
  ctx.fillStyle = style.scrollColor
  // 绘制滚动条左边
  if (scrollMaxX) {
    const ratioX = scrollLeft / scrollMaxX
    const width = clientWidth * this.scrollXRate
    const left = ratioX * (clientWidth - width - padding)
    const x = padding + left
    const y = clientHeight + padding
    ctx.beginPath()
    ctx.arc(r + x, y - r, r, 0, 2 * Math.PI)
    ctx.fillRect(r + x, y - scrollSize, width, scrollSize)
    ctx.arc(r + x + width, y - r, r, 0, 2 * Math.PI)
    ctx.fill()
  }
  if (this.scrollMaxY) {
    const ratioY = scrollTop / scrollMaxY
    const height = clientHeight * this.scrollYRate
    const top = ratioY * (clientHeight - height - padding)
    const x = clientWidth + padding
    const y = padding + top
    ctx.beginPath()
    ctx.arc(x - r, r + y, r, 0, 2 * Math.PI)
    ctx.fillRect(x - scrollSize, y + r, scrollSize, height)
    ctx.arc(x - r, r + y + height, r, 0, 2 * Math.PI)
    ctx.fill()
  }
}
