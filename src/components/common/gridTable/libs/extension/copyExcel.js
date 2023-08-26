const copy = function (el) {
  const range = document.createRange()
  const sel = window.getSelection()
  sel.removeAllRanges()
  try {
    range.selectNodeContents(el)
    sel.addRange(range)
    return document.execCommand("Copy")
  } catch (e) {
    range.selectNode(el)
    sel.addRange(range)
    return document.execCommand("Copy")
  }
}

// 复制cell
export const copyCellToExcel = function (data, headerLength) {
  const table = document.createElement("table")
  let tr = document.createElement("tr")
  let successful = false
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const td = document.createElement("td")
    if (i % headerLength === 0) {
      tr = document.createElement("tr")
    }
    td.textContent = item
    tr.appendChild(td)
    table.appendChild(tr)
  }
  document.body.appendChild(table)
  successful = copy(table)
  document.body.removeChild(table)
  return successful
}

export const copyToExcel = function (state, specList) {
  const headersMap = {}
  const columnsMap = {}
  const dataMap = {}
  let successful = false
  for (let i = 0; i < specList.length; i++) {
    const item = specList[i]
    if (!headersMap[item.cyl]) {
      headersMap[item.cyl] = []
    }
    if (!columnsMap[item.sph]) {
      columnsMap[item.sph] = []
    }
    headersMap[item.cyl].push(item)
    columnsMap[item.sph].push(item)
    dataMap[`${item.sph}${item.cyl}`] = item
  }
  const headers = Object.keys(headersMap)
    .map((key) => ({
      cyl: key,
      items: headersMap[key].sort((a, b) => Math.abs(a.sph) - Math.abs(b.sph))
    }))
    .sort((a, b) => Math.abs(a.cyl) - Math.abs(b.cyl))
  const columns = Object.keys(columnsMap)
    .map((key) => ({
      sph: key,
      items: columnsMap[key].sort((a, b) => Math.abs(a.cyl) - Math.abs(b.cyl))
    }))
    .sort((a, b) => Math.abs(a.sph) - Math.abs(b.sph))
  const table = document.createElement("table")
  if (state == "headers" || state == "title") {
    const header_tr = document.createElement("tr")
    if (state == "title") {
      const title = document.createElement("td")
      title.textContent = "球镜/柱镜"
      header_tr.appendChild(title)
    }
    headers.forEach((h) => {
      const td = document.createElement("td")
      td.textContent = h.cyl
      header_tr.appendChild(td)
    })
    table.appendChild(header_tr)
  }
  columns.forEach((c) => {
    const tr = document.createElement("tr")
    c.items.forEach((spec, index) => {
      if (["columns", "title"].includes(state) && index == 0) {
        const title2 = document.createElement("td")
        title2.textContent = c.sph
        tr.appendChild(title2)
      }
      const td = document.createElement("td")
      td.textContent = spec.text
      tr.appendChild(td)
    })
    table.appendChild(tr)
  })
  document.body.appendChild(table)
  successful = copy(table)
  document.body.removeChild(table)
  return successful
}
