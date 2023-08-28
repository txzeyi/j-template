export const moneyFormat = (val: string | number, symbol = false): string => {
  if (isNaN(+val)) {
    return "0.00"
  }
  if (symbol) {
    return +val > 0 ? "+" + (+val).toFixed(2) : (+val).toFixed(2)
  }
  return (+val).toFixed(2)
}
/**
 * @desc   判断`obj`是否为空
 * @param  {Object} obj
 * @return {Boolean}
 */
export const isEmptyObject = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false
  }
  return !Object.keys(obj).length
}

/**
 * @desc 判断两个数组是否相等
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Boolean}
 */
export const arrayEqual = (arr1, arr2) => {
  if (arr1 === arr2) {
    return true
  }
  if (arr1.length != arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}
/**
 * 范围取值
 * @param obj 取值对象
 * @param minField 最小值
 * @param maxField 最大值
 * @param formatter 格式化函数
 */
export const valueRange = (obj: any, minField: string, maxField: string, formatter: <T>(val: T) => T = (val) => val) => {
  if (obj[minField] === obj[maxField]) {
    return formatter(obj[minField])
  }
  return formatter(obj[minField]) + " ~ " + formatter(obj[maxField])
}

/**
 * 数值转K
 */
export const number2kilo = (val: string | number) => {
  if (isNaN(+val)) {
    return "0"
  }
  if (Number(val) > 0) {
    if (Number(val) >= 1000) {
      return parseInt((+val / 1000).toString()) + "K" + (Number(val) % 1000 ? "+" : "")
    }
    return val.toString()
  }
  if (Number(val) < -1000) {
    return parseInt((+val / 1000).toString()) + "K" + (Number(val) % 1000 ? "+" : "")
  }
  return val.toString()
}
/** 加法 */
export const plus = (a: number, b: number): number => {
  const str1 = String(a).split(".")
  let dot1: any[] = str1[1]?.split("") ?? [0]
  dot1 = dot1.map((item) => Number(item))

  const str2 = String(b).split(".")
  let dot2: any[] = str2[1]?.split("") ?? [0]
  dot2 = dot2.map((item) => Number(item))

  let count = Number(str1[0]) + Number(str2[0])
  const newArr = []
  const length = Math.max(dot1.length, dot2.length)
  for (let i = length - 1; i >= 0; i--) {
    let num: number = (dot1[i] ?? 0) + (dot2[i] ?? 0) + (newArr[i] ?? 0)
    if (num >= 10) {
      num -= 10
      if (i > 0) {
        newArr[i - 1] = 1
      } else {
        count++
      }
    }
    newArr[i] = num
  }
  return Number(count + "." + newArr.join(""))
}

const s4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export const guid = () => s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()

export const numberLimit = (
  val: string | number,
  modifiers: { int?: boolean; float?: boolean; abs?: boolean },
  extend: { min?: number; max?: number; empty?: boolean; fix?: number }
) => {
  const isInt = Boolean(modifiers?.int) //是否使用整形修饰符
  const isFloat = Boolean(modifiers?.float) //是否使用浮点修饰符
  const isAbs = Boolean(modifiers.abs) //是否使用绝对值(正数);

  const whiteChar = ["-", "+", "0."]
  if (whiteChar.includes(val)) {
    return val // 单个字符时，如果是符号，先不做处理
  }
  if (extend.empty && val.toString().trim() == "") {
    //允许空值
    val = ""
  } else {
    // 无修饰符仅处理为数字
    val = isNaN(parseFloat(val)) ? "" : parseFloat(val)
    if (isAbs) {
      val = Math.abs(val)
    }
    if (isInt) {
      //值转整形
      // 加上安全数字区域判断
      if (Number.MAX_SAFE_INTEGER < +val) {
        // 超过最大值
        val = extend.max ? extend.max : Number.MAX_SAFE_INTEGER // 默认整数最大安全值
      } else if (Number.MIN_SAFE_INTEGER > +val) {
        // 小于最小值
        val = extend.min ? extend.min : "" // 未设置最小值则清空
      } else {
        val = isNaN(parseInt(val)) ? "" : parseInt(val)
      }
    } else if (isFloat) {
      // 浮点型

      if (extend.fix) {
        //设置了精度需求
        val = (+val).toFixed(extend.fix)
      }
      extend.max = extend.max ? extend.max : Number.MAX_SAFE_INTEGER // 默认最大值
    }
    if (extend.min !== undefined) {
      //最小值
      if (val < extend.min) {
        //  小于最小值，设置为最小值
        val = extend.fix ? extend.min.toFixed(extend.fix) : extend.min
      }
    }
    if (extend.max !== undefined) {
      // 最大值
      if (val > extend.max) {
        // 大于最大值,设置为最大值(注意判断精度)
        val = extend.fix ? extend.max.toFixed(extend.fix) : extend.max
      }
    }
  }

  return val
}

/**
 *
 * @param {Array} arrs 树形数据
 * @param {string} childs 树形数据子数据的属性名,常用'children'
 * @param {Array} attrArr 需要提取的公共属性数组(默认是除了childs的全部属性)
 * @returns
 */
export const extractTree = (arrs, childs, attrArr?: string[]) => {
  let attrList = []
  if (!Array.isArray(arrs) && !arrs.length) {
    return []
  }
  if (typeof childs !== "string") {
    return []
  }
  if (!Array.isArray(attrArr) || (Array.isArray(attrArr) && !attrArr.length)) {
    attrList = Object.keys(arrs?.[0] ?? {})
    attrList.splice(attrList.indexOf(childs), 1)
  } else {
    attrList = attrArr
  }
  const list = []
  const getObj = (arr) => {
    arr.forEach(function (row) {
      const obj = {}
      attrList.forEach((item) => {
        obj[item] = row[item]
      })
      list.push(obj)
      if (row[childs]) {
        getObj(row[childs])
      }
    })
    return list
  }
  return getObj(arrs)
}

export const getRandomShallowColor = function () {
  function test(color) {
    return (color += "0123401234abcabc"[Math.floor(Math.random() * 16)]) && color.length == 6 ? color : test(color)
  }
  return "#" + test("") + "20"
}

// 树形数据扁平化
export const treeToArray = <T>(tree: T[], includesChildren = true): T[] => {
  return tree.reduce((res, item) => {
    const { childs, ...i } = item
    return res.concat(includesChildren ? item : i, childs && childs.length ? treeToArray(childs) : [])
  }, [])
}

/**
 * 隐藏中间
 * @param cardNo 隐藏的内容
 * @param head  头部显示几位 (如：手机号前面显示3位)
 * @param tail 尾部显示几位
 * @returns
 */
export const hideCenter = (cardNo: string, head = 4, tail = 4) => {
  if (!cardNo) {
    return ""
  }
  return `${cardNo?.substr(0, head)}****${cardNo?.substr(cardNo.length - tail, cardNo.length)}`
}
