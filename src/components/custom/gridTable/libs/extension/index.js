import { copyToExcel, copyCellToExcel } from "./copyExcel.js"
import { computeSelectBox } from "../draw/drawSelect.js"
import { getThValue } from "../utils.js"

// 上下左右
export const move = function (e) {
  const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this

  if (this.selectItems && this.selectItems.length) {
    const select = computeSelectBox.call(this)
    let scrollLeft = 0
    let scrollTop = 0
    if (e.code == "ArrowRight") {
      scrollLeft += cellWidth
      select.minX += cellWidth
      select.maxX += cellWidth
    } else if (e.code == "ArrowLeft") {
      scrollLeft -= cellWidth
      select.minX -= cellWidth
      select.maxX -= cellWidth
    } else if (e.code == "ArrowUp") {
      scrollTop -= cellHeight
      select.minY -= cellHeight
      select.maxY -= cellHeight
    } else if (e.code == "ArrowDown") {
      scrollTop += cellHeight
      select.minY += cellHeight
      select.maxY += cellHeight
    }
    const selects = []
    const minIndexX = Math.floor(select.minX / cellWidth) - 1
    const maxIndexX = Math.floor((select.maxX - cellWidth) / cellWidth) - 1
    const minIndexY = Math.floor(select.minY / cellHeight) - 1
    const maxIndexY = Math.floor((select.maxY - cellHeight) / cellHeight) - 1
    if (minIndexY < 0 || minIndexX < 0 || maxIndexX > this.headers.length || maxIndexY > this.columns.length) {
      return false
    }
    for (let i = 0; i < this.headers.length; i++) {
      if (i >= minIndexX && i <= maxIndexX) {
        const item = this.headers[i]
        for (let j = 0; j < item.items.length; j++) {
          if (j >= minIndexY && j <= maxIndexY) {
            selects.push(item.items[j])
          }
        }
      }
    }
    if (
      (select.minX <= padding + this.scrollLeft && scrollLeft < 0) ||
      (select.minY <= padding + this.scrollTop && scrollTop < 0) ||
      (select.maxX >= clientWidth - padding + this.scrollLeft && scrollLeft > 0) ||
      (select.maxY >= clientHeight - padding + this.scrollTop && scrollTop > 0)
    ) {
      this.setScroll(this.scrollLeft + scrollLeft, this.scrollTop + scrollTop)
    }
    this.selectItems = selects
    this.update()
  }
}

// 全选
export const allSelect = function () {
  this.selectState = "title"
  this.selectItems = [...this.quadrantData]
  this.intersectObject = { type: "title", items: this.selectItems }
  this.emit("titleSelect", this.intersectObject.items)
  this.update()
}

// 复制
export const copy = function () {
  if (this.selectItems && this.selectItems.length) {
    if (this.selectState === "cell") {
      let minX = 0
      let maxX = 0
      const headerInfo = {}
      this.headers.forEach((item, index) => {
        headerInfo[item.cyl] = index
      })
      for (let i = 0; i < this.intersectObject.items.length; i++) {
        const item = this.intersectObject.items[i]
        if (i == 0) {
          minX = headerInfo[item.cyl]
          maxX = headerInfo[item.cyl]
        } else {
          minX = Math.min(headerInfo[item.cyl], minX)
          maxX = Math.max(headerInfo[item.cyl], maxX)
        }
      }
      copyCellToExcel(
        this.intersectObject.items.map((item) => {
          let text = item[this.inputType] || ""
          if (this.on.cellRender) {
            const t = this.on.cellRender(item)
            if (t !== undefined || t !== null) {
              text = t
            }
          }
          return text
        }),
        maxX - minX + 1
      )
    } else {
      copyToExcel(
        this.selectState,
        this.intersectObject.items.map((item) => {
          let text = item[this.inputType] || ""
          if (this.on.cellRender) {
            const t = this.on.cellRender(item)
            if (t !== undefined || t !== null) {
              text = t
            }
          }
          return { cyl: item.cyl, sph: item.sph, text }
        })
      )
    }
    return true
  }
}

// 粘贴
export const paste = function (text) {
  // 二维表复制，给二维表，自动前面带了\n, 系统的坑
  if (text && text.substring(0, 1) == "\n") {
    text = text.substring(1)
  } else if (text && text.substring(0, 2) == "\r\n") {
    text = text.substring(2)
  }
  const testData = text
    .replace(/\n$/g, "")
    .split("\n")
    .map((item) => item.split("\t"))
  if (this.selectItems && this.selectItems.length) {
    const { cellWidth, cellHeight, clientWidth, clientHeight, padding } = this
    const select = computeSelectBox.call(this)
    const minIndexX = Math.floor(select.minX / cellWidth) - 1
    const minIndexY = Math.floor(select.minY / cellHeight) - 1
    const maxIndexX = minIndexX + testData[0].length
    const maxIndexY = minIndexY + testData.length
    if (testData.length == 1 && testData[0].length == 1) {
      for (let i = 0; i < this.selectItems.length; i++) {
        const it = this.selectItems[i]
        it[this.inputType] = String(testData[0][0]).replace(/[^\d.]/g, "")
        it[this.inputType] = Number(it[this.inputType])
      }
    } else {
      for (let c = 0; c < this.columns.length; c++) {
        const cl = this.columns[c]
        if (c >= minIndexY && c <= maxIndexY) {
          for (let h = 0; h < this.headers.length; h++) {
            const hl = this.headers[h]
            const key = `${getThValue(hl.cyl)}${getThValue(cl.sph)}`
            if (h >= minIndexX && h <= maxIndexX) {
              const it = this.dataMap[key]
              if (it && !it.disabled) {
                if (testData[c - minIndexY] && testData[c - minIndexY][h - minIndexX]) {
                  it[this.inputType] = String(testData[c - minIndexY][h - minIndexX]).replace(/[^\d.]/g, "")
                  it[this.inputType] = Number(it[this.inputType])
                }
              }
            }
          }
        }
      }
    }
    this.update()
  }
}
