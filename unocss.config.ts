import { defineConfig, presetAttributify, presetUno, Rule } from "unocss"

function getSizeRules(Mapping: Record<string, string>): Rule<{}>[] {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key]
    return [new RegExp(`^${key}(\\d+)$`), ([, d]) => ({ [value]: `${d}px` })]
  })
}

const sizeMapping: Record<string, string> = {
  h: "height",
  w: "width",
  m: "margin",
  p: "padding",
  mt: "margin-top",
  mr: "margin-right",
  ml: "margin-left",
  mb: "margin-bottom",
  pt: "padding-top",
  pr: "padding-right",
  pl: "padding-left",
  pb: "padding-bottom",
  fs: "font-size",
  br: "border-radius"
}

export default defineConfig({
  /** 排除 */
  exclude: ["node_modules", ".git", ".husky", ".vscode", "dist", "public", "build", "mock", "./stats.html"],
  /** 预设 */
  presets: [
    presetAttributify(), // 属性化模式 & 无值的属性模式
    presetUno() // 默认预设
  ],
  /** 自定义规则 */
  rules: [
    ["app-container", { height: "100%" }],
    ["borderEEE", { "border-color": "#EEE" }],
    ["boxShadow", { "box-shadow": "0px 0px 8px rgba(0, 0, 0, .08)" }],
    ["boxShadow-lg", { "box-shadow": "0px 0px 16px rgba(0, 0, 0, .08)" }],
    ["boxShadow-border", { "box-shadow": "0px 0px 1px rgba(0, 0, 0, 1)" }],
    ["boxShadow-basic", { "box-shadow": "0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08)" }],
    ["boxShadow-light", { "box-shadow": "0px 0px 12px rgba(0, 0, 0, .12)" }],
    ["boxShadow-lighter", { "box-shadow": "0px 0px 8px rgba(0, 0, 0, .12)" }],
    ["boxShadow-half", { "box-shadow": "0px 0px 4px rgba(0, 0, 0, .12)" }],
    ["invisible", { visibility: "hidden" }],
    ["bg", { "background-color": "#F7F7F7" }],
    [
      "boxShadow-dark",
      { "box-shadow": "0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16)" }
    ],
    ...getSizeRules(sizeMapping)
  ],
  /** 自定义快捷方式 */
  shortcuts: {
    "wh-full": "w-full h-full",
    "flex-center": "flex justify-center items-center",
    "flex-between": "flex justify-between items-center",
    "flex-col-center": "flex-center flex-col",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center",
    "i-flex-center": "inline-flex justify-center items-center",
    "i-flex-x-center": "inline-flex justify-center",
    "i-flex-y-center": "inline-flex items-center",
    "flex-col": "flex flex-col",
    "flex-col-stretch": "flex-col items-stretch",
    "i-flex-col": "inline-flex flex-col",
    "i-flex-col-stretch": "i-flex-col items-stretch",
    "flex-1-hidden": "flex-1 overflow-hidden",
    "absolute-lt": "absolute left-0 top-0",
    "absolute-lb": "absolute left-0 bottom-0",
    "absolute-rt": "absolute right-0 top-0",
    "absolute-rb": "absolute right-0 bottom-0",
    "absolute-tl": "absolute-lt",
    "absolute-tr": "absolute-rt",
    "absolute-bl": "absolute-lb",
    "absolute-br": "absolute-rb",
    "absolute-center": "absolute-lt flex-center wh-full",
    "fixed-lt": "fixed left-0 top-0",
    "fixed-lb": "fixed left-0 bottom-0",
    "fixed-rt": "fixed right-0 top-0",
    "fixed-rb": "fixed right-0 bottom-0",
    "fixed-tl": "fixed-lt",
    "fixed-tr": "fixed-rt",
    "fixed-bl": "fixed-lb",
    "fixed-br": "fixed-rb",
    "fixed-center": "fixed-lt flex-center wh-full",
    "nowrap-hidden": "whitespace-nowrap overflow-hidden",
    "ellipsis-text": "nowrap-hidden overflow-ellipsis",
    "transition-base": "transition-all duration-300 ease-in-out",
    "main-body": "bg-white rounded-3xl p-6",
    "hover-primary": "cursor-pointer hover:text-orange-500",
    "j-card-box": "bg-white overflow-hidden boxShadow-lg",
    "bold-red": "font-bold text-red-500",
    "text-red": "text-red-500",
    "border-1": "border border-1 border-gray-80",
    "border-left": "border-l border-gray-80",
    "border-right": "border-r border-gray-80",
    "border-top": "border-t border-gray-80",
    "border-bottom": "border-b border-gray-80",
    cp: " cursor-pointer"
  },

  theme: {
    // extend: {
    colors: {
      red: {
        "100": "#fef4e5",
        "500": "#ff4747"
      },
      light: {
        "400": "#f4f4f4"
      },
      blue: {
        "30": "#E9f0ff",
        "300": "#3168EC",
        "500": "#5789FF",
        "800": "#3e93d5"
      },
      orange: {
        "20": "#fffaf5",
        "30": "#fff6e6",
        "40": "#f2e4d5",
        "50": "#ffe4c7",
        "60": "#f8e0c8",
        "100": "#FFA54B",
        "500": "#ff8909",
        "600": "#FF6B3B",
        "700": "#FF7030"
      },
      yellow: {
        "50": "#FBF9F6",
        "800": "#D9A956"
      },
      gray: {
        "50": "#F7F7F7",
        "80": "#EEEEEE",
        "100": "#E1E1E1",
        "200": "#F8F8F8",
        "400": "#4E5569",
        "600": "#cccccc",
        "700": "#707070",
        "800": "#B3B3B3",
        "900": "#989898",
        "999": "#333333"
      }
    }
    // }
  }
})
