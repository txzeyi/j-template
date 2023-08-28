/** 设置对象数据 */
export function objectAssign<T extends Record<string, any>>(target: T, source: Partial<T>) {
  Object.assign(target, source)
}

export const processGoodsSort = (list: any[]) => {
  return list.sort((a, b) => a.processGoodsType - b.processGoodsType).sort((a) => (a.processGoodsType === 1 ? -1 : 1))
}
