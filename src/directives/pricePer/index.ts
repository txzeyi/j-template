const insertAfter = (newElement: HTMLElement, targetElement: HTMLElement) => {
  const parent = targetElement.parentNode as HTMLElement //获取目标节点的父级标签
  if (parent.lastChild == targetElement) {
    //如果目标节点正好是最后一个节点，使用appendChild插入
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling) //一般情况下要取得目标节点的下一个节点，再使用insertBefore()方法。
  }
}

const getNextElement = (node: HTMLElement) => {
  const next = node.nextSibling
  if (next !== null && next.nodeType === 3) {
    //防止内联元素在ie下出现的空白节点和火狐下的空白节点
    return next.nextSibling
  }
  return next
}

const handler = (el: HTMLElement, binding: any) => {
  if (!binding.value) {
    // 价格需显示为？？？
    //方案1： 当前元素透明度改为0,为其添加伪元素，并采用定位覆盖在原位置  实验结果不可行，透明度会影响伪元素
    //方案2：当前元素隐藏或透明度改为0或宽高改为0，为其添加兄弟元素显示问号
    const classes = Object.values(el.classList)
    el.classList.add("price-per-origin")
    const noPerEl = document.createElement("div")
    noPerEl.innerHTML = "???"
    classes.forEach((ele) => noPerEl.classList.add(ele))
    noPerEl.classList.add("price-per-replace")
    insertAfter(noPerEl, el)
  } else {
    el.classList.remove("price-per-origin")
    const nextEle = getNextElement(el)
    if (nextEle && nextEle.classList.contain("price-per-replace")) {
      nextEle.remove()
    }
  }
}

export const pricePer = {
  mounted(el: HTMLElement, binding: any) {
    handler(el, binding)
  },
  updated(el: HTMLElement, binding: any) {
    handler(el, binding)
  }
}
