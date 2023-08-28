import Process from "@/assets/image/incomeProcess.png"
import NotProcess from "@/assets/image/notProcess.png"

export default () => {
  /**
   * 获取图片
   * @param list
   * @returns string
   */
  const getImgUrl = (list: { url: string }[]) => {
    if (!list?.length) {
      return ""
    }
    if (list[0].url.substring(list[0].url.length - 3) == "mp4") {
      return list[1]?.url || ""
    }
    return list[0].url || ""
  }

  /**
   * 新增Tab去重
   */
  const defaultList = [...Array(100).keys()].map((i) => ++i)
  const getItemIndex = (list: { title: string }[]) => {
    if (!list?.length || !list) {
      return ""
    }
    const _list = list?.map((i) => +i.title?.slice(-2).replace(/[\u4e00-\u9fa5]/g, "0") || "0")
    return defaultList.filter((i) => !_list.includes(i))[0]
  }
  /**
   * 加工单重组
   * 1.加工单多单商品拆分
   * @param list
   */
  const useProcessFormat = (list: any[]) => {
    const processOrder = JSON.parse(JSON.stringify(list))
    console.log("processOrder", processOrder)
    const shoppingCartVOList: any = []
    processOrder?.forEach((_item: any) => {
      _item.eyeType = _item.processGoodsType
      _item.afterSalesNumber = _item.salesOrderSpecVOList?.[0]?.afterSalesNumber || 0
      _item.sendReturnNumber = _item.salesOrderSpecVOList?.[0]?.sendReturnNumber || 0
      _item.replacedNumber = _item.salesOrderSpecVOList?.[0]?.replacedNumber || 0
      _item.refundedNumber = _item.salesOrderSpecVOList?.[0]?.refundedNumber || 0
      _item.sendOutNumber = _item.salesOrderSpecVOList?.[0]?.sendOutNumber || 0
      _item.passNumber = _item.salesOrderSpecVOList?.[0]?.passNumber || 0
      const processItem = {
        processNo: _item.processNo,
        shoppingCartVOList: [_item],
        remark: _item.remark,
        processImgList: _item.processImgList,
        isChecked: false,
        predictTime: _item.salesOrderSpecVOList?.[0]?.shippingSpecList?.[0]?.shippingTime || ""
      }
      const _index = shoppingCartVOList.findIndex((row: any) => row.processNo == _item.processNo)
      if (_index == -1) {
        shoppingCartVOList.push(processItem)
      } else {
        shoppingCartVOList[_index].shoppingCartVOList.push(_item)
      }
      console.log("shoppingCartVOList", shoppingCartVOList)
    })
    return shoppingCartVOList
  }

  /**
   * 加工单-加工状态图片
   * @param processKey  20来片加工 23来架加工  21不加工
   * @returns
   */
  const getProcessImg = (processKey: number) => {
    if ([20, 23].includes(processKey)) {
      return Process
    }
    return NotProcess
  }
  return {
    getImgUrl,
    getItemIndex,
    useProcessFormat,
    getProcessImg
  }
}
