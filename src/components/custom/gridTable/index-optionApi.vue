<template>
  <div ref="wrapper" class="gridTableWrapper" @click.stop.prevent="gridCellItemPopupHide">
    <canvas :id="id" :style="`width: 100%;height:100%`"></canvas>
    <transition name="gridCellItemPopupFade">
      <div v-if="showCellItem && showCellItemPopup" class="gridCellItemPopup" :style="gridCellItemPopupStyle">
        <span class="gridCellItem">
          <slot v-if="inputType == 'price'" name="cellItem">当前数量：{{ cellItem.number }}</slot>
          <slot v-else-if="inputType == 'number'" name="cellItem">当前价格：{{ cellItem.price }}</slot>
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import GridTable from "./libs/index.js"

let gridTableId = 1

export default {
  name: "GridTable",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    canNumberInput: {
      type: Boolean,
      default: true
    },
    inputType: {
      type: String,
      default: "number"
    },
    showSummary: {
      type: Boolean,
      default: true
    },
    cellRender: {
      type: Function
    },
    summaryRender: {
      type: Function
    },
    cellPopupRender: {
      type: Function
    },
    showCellItemPopup: {
      type: Boolean,
      default: true
    }
  },
  data() {
    gridTableId += 1
    return {
      id: `gridTableId${gridTableId}`,
      gridCellItemPopupStyle: "",
      cellItem: {},
      showCellItem: false
    }
  },
  watch: {
    inputType() {
      this.setInputType(this.inputType)
    },
    data: {
      handler(val) {
        this.setList(val)
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      const that = this
      this.instance = new GridTable({
        el: `#${this.id}`, // canvas父级元素
        data: this.data, // 数据
        showSummary: this.showSummary,
        canNumberInput: this.canNumberInput,
        instance: this.instance,
        on: {
          valueChange(selectItems, oldSelectItems) {
            that.valueChange(selectItems, oldSelectItems)
          },
          headersSelect(data) {
            that.gridCellItemPopupHide()
          },
          columnsSelect(data) {
            that.gridCellItemPopupHide()
          },
          cellSelect(data) {
            if (data.length === 1) {
              that.gridCellItemPopupShow(data)
            } else {
              that.gridCellItemPopupHide()
            }
            that.cellSelect()
          },
          scroll(data) {
            if (data.length === 1) {
              that.gridCellItemPopupShow(data)
            } else {
              that.gridCellItemPopupHide()
            }
          },
          titleSelect(data) {
            that.gridCellItemPopupHide()
          },
          copy() {
            that.$message({ message: "复制成功", type: "success" })
          },
          cellRender: this.cellRender,
          summaryRender: this.summaryRender
        }
      })
    })
    document.addEventListener("click", this.resetSelectItem)
    // this.$once('hook:beforeDestroy', () => {
    //   document.removeEventListener('click', this.resetSelectItem)
    // })
  },
  beforeUnmount() {
    this.instance && this.instance.destroy()
  },
  methods: {
    setInputType(type) {
      this.instance.setInputType(type)
    },
    typeChange(cyl, sph) {
      if (cyl && sph) {
        this.quadrantTypeChange(3)
      }
      if (cyl && !sph) {
        this.quadrantTypeChange(2)
      }
      if (!cyl && sph) {
        this.quadrantTypeChange(1)
      }
      if (!cyl && !sph) {
        this.quadrantTypeChange(0)
      }
    },
    quadrantTypeChange(quadrantType) {
      if (this.instance) {
        this.instance.quadrantTypeChange(quadrantType)
        this.instance.update()
      }
    },
    setList(data) {
      this.instance && this.instance.setData(data)
    },
    resetSelectItem() {
      this.instance.selectItems = []
      this.instance.update()
      this.showCellItem = false
      this.cellSelect()
    },
    cellSelect() {
      this.$emit("cellSelect", this.instance.selectItems, this.instance.data)
    },
    getSelectData() {
      return this.instance.selectItems
    },
    getNowData() {
      return this.instance && this.instance.quadrantData
    },
    getAllData() {
      const dataArr = Object.keys(this.instance.dataMap)
      if (dataArr.length !== this.instance.data.length) {
        return dataArr.map((key) => this.instance.dataMap[key])
      }
      return this.instance.data
    },
    reset() {
      this.instance.data.forEach((item) => {
        item[this.inputType] = ""
      })
      this.instance.selectItems = []
      this.instance.update()
      this.cellSelect()
    },
    update() {
      if (this.instance) {
        this.instance.update()
      }
    },
    refresh() {
      if (this.instance) {
        this.instance.refresh()
      }
    },
    setHeight(h) {
      if (this.instance) {
        this.instance.clientHeight = h
        this.instance.optionHeight = h
        this.instance.refresh()
      }
    },
    gridCellItemPopupHide() {
      this.showCellItem = false
    },
    wrapperClick(e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.target == e.currentTarget) {
        // 说明是外层
        this.resetSelectItem()
      }
    },
    gridCellItemPopupShow(data) {
      const item = data[0]
      let headerIndex = 0
      let columnsIndex = 0
      for (let i = 0; i < this.instance.headers.length; i++) {
        const _item = this.instance.headers[i]
        if (_item.cyl == item.cyl) {
          headerIndex = i
          break
        }
      }
      for (let i = 0; i < this.instance.columns.length; i++) {
        const _item = this.instance.columns[i]
        if (_item.sph == item.sph) {
          columnsIndex = i
          break
        }
      }
      const x = this.instance.padding - this.instance.scrollLeft + this.instance.cellWidth * (headerIndex + 1.5)
      const y = this.instance.padding - this.instance.scrollTop + this.instance.cellHeight * (columnsIndex + 2.4)
      this.gridCellItemPopupStyle = `top:${y}px;left:${x}px;`
      if (this.cellPopupRender) {
        this.cellItem = this.cellPopupRender(item)
      } else {
        this.cellItem = item
      }
      this.showCellItem = true
    },
    valueChange(selectItems, oldSelectItems) {
      for (let i = 0; i < selectItems.length; i++) {
        const item = selectItems[i]
        const oldItem = oldSelectItems[i]
        if (this.inputType === "price") {
          item[this.inputType] = this.priceFormatInput(item[this.inputType], oldItem[this.inputType])
        } else {
          item[this.inputType] = this.numberFormatInput(item[this.inputType], oldItem[this.inputType])
        }
      }
      this.$emit("numberInput", selectItems)
    },
    numberFormatInput(newVal, oldValue) {
      const val = Number(newVal)
      if (newVal === "") {
        return ""
      }
      if (val === 0) {
        return "0"
      }
      if (isNaN(val)) {
        return oldValue
      }
      if (val > 99999999.99) {
        return oldValue
      }
      return val
    },
    priceFormatInput(newVal, oldValue) {
      const val = Number(newVal)
      if (newVal === "") {
        return ""
      }
      if (isNaN(val)) {
        return oldValue
      }
      if (val > 99999999.99) {
        return oldValue
      }
      return val
    }
  }
}
</script>

<style lang="scss" scoped>
.gridTableWrapper {
  display: block;
  position: relative;
  width: 100%;
}

.gridCellItemPopup {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 10;
  transform: translateX(-50%);
  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: -10px;
    left: 50%;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fff;
    transform: translateX(-50%);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    z-index: 10px;
  }
  .gridCellItem {
    display: block;
    width: 100%;
    height: 51px;
    line-height: 51px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    white-space: nowrap;
    strong {
      color: #ff4747;
    }
  }
}
.gridCellItemPopupFade-enter-active,
.gridCellItemPopupFade-leave-active {
  transition: opacity 0.5s;
}
.gridCellItemPopupFade-enter,
.gridCellItemPopupFade-leave-to {
  opacity: 0;
}
</style>
