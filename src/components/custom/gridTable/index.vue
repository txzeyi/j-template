<template>
  <div ref="wrapper" class="gridTableWrapper" @click.stop.prevent="gridCellItemPopupHide" v-clickOutSide="() => resetSelectItem()">
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

<script setup lang="ts">
import { EQuadrantType } from "@/enum"
import { genLight, IStockGoodsSpec } from "@/utils/common"
import GridTable from "./libs/index"

interface IGridTableProps {
  canNumberInput?: boolean //是否可以输入
  inputType?: string // 输入的字段
  showSummary?: boolean // 是否显示合计
  cellRender?: () => any //表格格子的渲染自定义内容
  summaryRender?: () => any // 合计的自定义渲染方法
  cellPopupRender?: () => any //格子的弹出框内容
  showCellItemPopup?: boolean // 是否显示格子弹出层
  quadrantType?: EQuadrantType // 象限
  data: IStockGoodsSpec[] //二维表数据
  allLight?: boolean // 是否展示全光度
}

const props = withDefaults(defineProps<IGridTableProps>(), {
  canNumberInput: false,
  inputType: "number",
  showSummary: false,
  data: () => [],
  quadrantType: 0,
  allLight: false
})

const emits = defineEmits(["numberInput", "cellSelect", "dataChange", "update:data"])

const gridTableId = ref(1) // 二维表的id
const id = ref(`gridTable${gridTableId.value}`)
const gridCellItemPopupStyle = ref("")
const cellItem = ref<{ number: string; price: string }>({} as any)
const showCellItem = ref(false)
// const instance = ref<any>(null)
let instance = null as any
const wrapper = ref(null)
//重设输入字段
const setInputType = (type: string) => {
  instance?.setInputType(type)
}

const typeChange = (cyl: number, sph: number) => {
  if (cyl && sph) {
    quadrantTypeChange(3)
  }

  if (cyl && !sph) {
    quadrantTypeChange(1)
  }
  if (!cyl && sph) {
    quadrantTypeChange(2)
  }

  if (!cyl && !sph) {
    quadrantTypeChange(0)
  }
}

// 改变象限
const quadrantTypeChange = (quadrantType: number) => {
  instance?.quadrantTypeChange(quadrantType)
  instance?.update()
}

// 输入变化
const valueChange = (selectItems: any[], oldSelectItems: any[]) => {
  for (let i = 0; i < selectItems.length; i++) {
    const item = selectItems[i]
    const oldItem = oldSelectItems[i]
    if (props.inputType.includes("rice")) {
      // 包含rice,如price ,xxxPrice.....
      item[props.inputType] = priceFormatInput(item[props.inputType], oldItem[props.inputType])
    } else {
      item[props.inputType] = numberFormatInput(item[props.inputType], oldItem[props.inputType])
    }
  }
  emits("numberInput", selectItems)
  // emits('dataChange', instance.data)
  emits(
    "dataChange",
    instance.data.filter((ele) => !ele.isVir)
  )
  // emits(
  //   "update:data",
  //   instance.data.filter((ele) => !ele.isVir)
  // )
}

//输入格式化
const numberFormatInput = (newVal: number | string, oldValue: number | string) => {
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
}
const priceFormatInput = (newVal: number | string, oldValue: number | string) => {
  const val = Number(newVal)
  if (newVal === "") {
    return ""
  }

  const reg = /^\d{1,8}((\.\d{0,2})?)$/ // 范围0.00 - 99999999.99
  // const reg = /^(([9]{8}(\.[0]{0,2})?)|((?!([9]{8}))\d{1,8}(\.\d{0,2})?))$/ //范围0.00-99999999.00

  if (reg.test(newVal.toString())) {
    return newVal
  }
  return oldValue
  if (isNaN(val)) {
    return oldValue
  }
  if (val > 99999999.99) {
    return oldValue
  }
  return val
}

// 重设二维表数据
const setList = (data: any[]) => {
  // data.forEach((item) => {
  //   // 解决历史丢失的问题
  //   if (item.cyl === undefined) {
  //     console.log(item)
  //     item.cyl = 0
  //   }
  //   if (item.sph === undefined) {
  //     console.log(item)

  //     item.sph = 0
  //   }
  // })
  const list = data.filter((ele) => ele.sph != undefined && ele.cyl != undefined)
  // 检查是否显示全光度，如果需要，生成全光度再更新数据
  if (props.allLight) {
    instance?.setData(genAllLight(list))
  } else {
    instance?.setData(list)
  }
}

// 重设选中格子的数据
const resetSelectItem = () => {
  instance && (instance.selectItems = [])
  instance && instance.update()
  showCellItem.value = false
  cellSelect()
}

// 格子呗选中
const cellSelect = () => {
  emits("cellSelect", instance?.selectItems, instance?.data)
}
//获取当前选中格数据
const getSelectData = () => {
  return instance?.selectItems
}
//获取当前象限数据
const getNowData = () => {
  return instance?.quadrantData
}

//获取所有数据
const getAllData = () => {
  return instance?.data.filter((ele) => !ele.isVir)
}

//重置数据
const reset = () => {
  instance?.data?.forEach((item: any) => {
    item[props.inputType] = ""
  })
  instance && (instance.selectItems = [])
  instance?.update()
  cellSelect()
}

// 强制更新
const update = () => {
  instance && instance.update()
}

//刷新二维表
const refresh = () => {
  instance?.refresh()
}
// 设置二维表高度
const setHeight = (h: number) => {
  if (instance) {
    instance.clientHeight = h
    instance.optionHeight = h
    instance.refresh()
  }
}

const gridCellItemPopupHide = () => {
  setTimeout(() => {
    showCellItem.value = false
  }, 500)
}
const wrapperClick = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.target == e.currentTarget) {
    // 说明是外层
    resetSelectItem()
  }
}
const gridCellItemPopupShow = (data: any[]) => {
  const item = data[0]
  let headerIndex = 0
  let columnsIndex = 0
  for (let i = 0; i < instance?.headers?.length; i++) {
    const _item = instance?.headers[i]
    if (_item.cyl == item.cyl) {
      headerIndex = i
      break
    }
  }
  for (let i = 0; i < instance?.columns?.length; i++) {
    const _item = instance?.columns[i]
    if (_item.sph == item.sph) {
      columnsIndex = i
      break
    }
  }
  const x = instance?.padding - instance?.scrollLeft + instance?.cellWidth * (headerIndex + 1.5)
  const y = instance?.padding - instance?.scrollTop + instance?.cellHeight * (columnsIndex + 2.4)
  gridCellItemPopupStyle.value = `top:${y}px;left:${x}px;`
  if (props.cellPopupRender) {
    cellItem.value = props.cellPopupRender(item)
  } else {
    cellItem.value = item
  }
  showCellItem.value = true
}

onMounted(() => {
  nextTick(() => {
    console.log("重新挂载了")
    instance = new GridTable({
      el: `#${id.value}`, // canvas父级元素
      data: props.allLight ? genAllLight(cloneOriginData.value) : cloneOriginData.value, // 数据
      showSummary: props.showSummary,
      canNumberInput: props.canNumberInput,
      instance,
      quadrantType: props.quadrantType,
      inputType: props.inputType,
      on: {
        valueChange(selectItems: any[], oldSelectItems: any[]) {
          valueChange(selectItems, oldSelectItems)
        },
        headersSelect(data: any[]) {
          gridCellItemPopupHide()
        },
        columnsSelect(data: any[]) {
          gridCellItemPopupHide()
        },
        cellSelect(data: any[]) {
          if (data.length === 1) {
            gridCellItemPopupShow(data)
          } else {
            gridCellItemPopupHide()
          }
          cellSelect()
        },
        scroll(data: any[]) {
          if (data.length === 1) {
            gridCellItemPopupShow(data)
          } else {
            gridCellItemPopupHide()
          }
        },
        titleSelect(data: any[]) {
          gridCellItemPopupHide()
        },
        copy() {
          ElMessage.success("复制成功")
        },
        blur() {
          resetSelectItem()
        },
        cellRender: props.cellRender,
        summaryRender: props.summaryRender
      }
    })
  })
})

onBeforeUnmount(() => {
  console.log("销毁中")
  instance?.destroy()
  document.removeEventListener("click", resetSelectItem)
})

onUnmounted(() => {
  instance?.destroy()
  document.onkeydown = null

  document.removeEventListener("click", resetSelectItem)
})

watch(
  () => props.inputType,
  (val) => {
    setInputType(val)
  }
)

// 二维表不再使用传入的数据[改变原数据会导致原数据更新，监听全光度的情况下，数据变动会导致重新渲染，选中状态被清空]，使用克隆数据
const cloneOriginData = ref([])

watch(
  () => props.data,
  (val) => {
    cloneOriginData.value = JSON.parse(JSON.stringify(val))
    setList(cloneOriginData.value)
  },
  { deep: true, immediate: true }
)

watch(
  () => props.quadrantType,
  (val) => {
    quadrantTypeChange(val)
  }
)

watch(
  () => props.cellRender,
  (val) => {
    console.log(val, "cellRender变化")
    update()
  }
)

// 全光度
const genAllLight = (data) => {
  const genForm = {
    sphMin: -36,
    sphMax: 36,
    cylMin: -18,
    cylMax: 18,
    isVir: true,
    price: "",
    sphScale: 0.25,
    cylScale: 0.25,
    quadrantType: 0
  }

  const allLight = genLight(genForm)

  // 1. 根据已有光度，去替换全光度种对应的光度

  const allLightMap: { [key: string]: IStockGoodsSpec } = {}

  allLight.forEach((ele: IStockGoodsSpec) => (allLightMap[`${ele.sph}~${ele.cyl}`] = ele))

  data.forEach((ele: IStockGoodsSpec) => {
    allLightMap[`${ele.sph}~${ele.cyl}`] = ele
  })

  return Object.values(allLightMap)

  // TODO:外面将不可使用组件绑定的数据【不再可信】
  // TODO: 提供获取非虚拟数据的方法[getAllData过滤，getQuadrantData过滤]
}
watch(
  () => props.allLight,
  () => setList(cloneOriginData.value)
)

//向外暴露
defineExpose({
  setList,
  setInputType,
  resetSelectItem,
  getSelectData,
  getNowData,
  getAllData,
  reset,
  update,
  refresh,
  setHeight,
  quadrantTypeChange,
  wrapperClick,
  typeChange,
  instance
})
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
