import { Directive } from "vue"

/**
 * v-number  默认为v-number.float 限制数字输入，
 * v-number.int 限制整数输入
 * v-number.abs 限制正数(可与其他修饰符组合) v-number.int.abs....
 * v-number.int="{min:-1,max:8}" 限制整数输入，范围-1 - 8
 * v-number.float="{min:0.3,max:1,fix:3}" 转为浮点数，范围(0.3,1),精度小数3位
 * v-number.int="{min:0,empty:true}" 如果想允许输入框为空，可设置empty，则不会被自动转为0
 */
const onInput = (ele: any, el: HTMLElement, bindings: any) => {
  const handle = () => {
    const isInt = bindings.modifiers.int //是否使用整形修饰符
    const isFloat = bindings.modifiers.float //是否使用浮点修饰符
    const isAbs = bindings.modifiers.abs //是否使用绝对值(正数);
    const bindingsVal = bindings.value || {} //绑定值

    let val = ele.value
    const whiteChar = ["-", "+", "0."]
    if (whiteChar.includes(val)) {
      return // 单个字符时，如果是符号，先不做处理
    }
    if (bindingsVal && bindingsVal.empty && val.toString().trim() == "") {
      //允许空值
      ele.value = ""
    } else {
      // 无修饰符仅处理为数字
      // eslint-disable-next-line no-lonely-if
      if (isNaN(parseFloat(val)) && bindingsVal.empty) {
        // 如果设置了允许empty,那么NaN时，返回为空，否则会返回0
        val = ""
      } else {
        val = isNaN(parseFloat(val)) ? "" : parseFloat(val)
        if (isAbs) {
          val = Math.abs(val)
        }
        if (isInt) {
          //值转整形
          // 加上安全数字区域判断
          if (Number.MAX_SAFE_INTEGER < +val) {
            // 超过最大值
            val = bindingsVal.max ? bindingsVal.max : Number.MAX_SAFE_INTEGER // 默认整数最大安全值
          } else if (Number.MIN_SAFE_INTEGER > +val) {
            // 小于最小值
            val = bindingsVal.min ? bindingsVal.min : "" // 未设置最小值则清空
          } else {
            val = isNaN(parseInt(val)) ? "" : parseInt(val)
          }
        } else if (isFloat) {
          // 浮点型

          if (bindings.value && bindingsVal.fix) {
            //设置了精度需求
            val = (+val).toFixed(bindings.value.fix)
          }
          bindings.value.max = bindingsVal.max ? bindingsVal.max : Number.MAX_SAFE_INTEGER // 默认最大值
        }
        if (bindings.value && bindingsVal.min !== undefined) {
          //最小值
          if (val < bindingsVal.min) {
            //  小于最小值，设置为最小值
            val = bindingsVal.fix ? bindingsVal.min.toFixed(bindings.value.fix) : bindingsVal.min
          }
        }
        if (bindings.value && bindingsVal.max !== undefined) {
          // 最大值
          if (val > bindingsVal.max) {
            // 大于最大值,设置为最大值(注意判断精度)
            val = bindingsVal.fix ? bindingsVal.max.toFixed(bindings.value.fix) : bindingsVal.max
          }
        }
      }
    }

    ele.value = val
    if (bindings.instance) {
      // bindings.instance.$emit('input', ele.value)
      const eventObj = document.createEvent("HTMLEvents")
      eventObj.initEvent("input", true, true)
      ele.dispatchEvent(eventObj)
    } else {
      el.dispatchEvent(new Event("input", ele.value))
    }
  }
  return handle
}

export const number: Directive = {
  mounted(el: HTMLElement, bindings: any) {
    const ele = el.tagName === "INPUT" ? el : (el.querySelector("input") as HTMLInputElement)
    if (ele) {
      ele.addEventListener("blur", onInput(ele, el, bindings), false)
    }
  }
}
