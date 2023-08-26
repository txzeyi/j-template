export const optionsInit = function (_options) {
  const options = {
    el: _options.el,
    data: _options.data || [],
    quadrantType: _options.quadrantType || 0, // 默认象限
    resize: !!_options.resize, // 自动计算
    showSummary: !!_options.showSummary, // 是否显示合计
    showTouchHot: !!_options.showTouchHot, // 是否显示触摸点
    inputType: _options.inputType || "number", // 默认字段
    canNumberInput: !!_options.canNumberInput,
    style: {
      cellWidth: "92px", // 格子宽度
      cellHeight: "50px", // 格子高度
      titleFontColor: "#333333", // 标题字体颜色
      titleFontSize: "14px", // 标题字体大小
      titleFontWeight: "bold", // 标题字体粗细  normal / bold
      titleFontFamily: "Microsoft YaHei", // 标题字体库
      titlePaddingLeftRight: "10px", // 标题距离左右间隔
      titlePaddingTopBotton: "7px", // 标题距离上下间隔

      borderColor: "#cccccc", // 边框颜色
      borderActiveColor: "#FF8909", // 选中单元格边框颜色
      selectBgColor: "#eeeeee", // 选中单元格背景颜色
      sputteringBgColor: "#FFF5E9", // 选中单元格同行同列背景颜色

      disabledBgColor: "#ebebeb", // 禁止背景颜色
      disabledLine: "#b9b9b9", // 禁止背景颜色

      pointSize: "12px",

      thBgColor: "#f8f8f8", // 表头背景颜色
      thFontColor: "#333333", // 表头字体颜色
      thFontSize: "14px", // 表头字体大小
      thFontWeight: "normal", // 表头字体粗细  normal / bold
      thFontFamily: "Microsoft YaHei", // 表头字体库

      tdBgColor: "#ffffff", // 单元格背景颜色
      tdFontColor: "#333333", // 单元格字体颜色
      tdFontSize: "14px", // 单元格字体大小
      tdFontWeight: "normal", // 单元格字体粗细  normal / bold
      tdFontFamily: "Microsoft YaHei", // 单元格字体库

      scrollSize: "7px", // 滚动条宽度
      scrollColor: "#ccc", // 滚动条颜色

      padding: _options.padding || "12px" // 内间距
    },
    on: {},
    render: {},
    validate: {}
  }
  if (_options.style) {
    for (const x in options.style) {
      if (typeof _options.style[x] === typeof options.style[x]) {
        options.style[x] = _options.style[x]
      }
    }
  }
  if (_options.on) {
    options.on = { ..._options.on }
  }
  return options
}
