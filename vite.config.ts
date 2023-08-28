import { loadEnv } from "vite"
import type { ConfigEnv, UserConfigExport } from "vite"
import vue from "@vitejs/plugin-vue"

import path, { resolve } from "path"
import ElementPlus from "unplugin-element-plus/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import UnoCSS from "unocss/vite"
import PiniaAutoRefs from "pinia-auto-refs"

import { viteMockServe } from "vite-plugin-mock"

// https://vitejs.dev/config/
export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  process.title = "条码系统"
  return {
    /** 打包时根据实际情况修改 base */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "~": resolve(process.cwd()),
        "@": resolve(__dirname, "./src")
      }
    },
    plugins: [
      vue(),
      ElementPlus(),
      PiniaAutoRefs(),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      /** UnoCSS */
      UnoCSS(),
      Components({
        extensions: ["vue"],
        resolvers: [ElementPlusResolver({ importStyle: "sass" })], //自动按需导入 Element-Plus 组件
        dirs: ["src/components/"],
        dts: true
      }),
      /** 自动按需引入 */
      AutoImport({
        imports: ["vue", "vue-router", "pinia", { "@/helper/pinia-auto-refs": ["useStore"] }],
        /** 自动按需导入 Element-Plus 相关函数，比如 ElMessage */
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        eslintrc: {
          enabled: false, // 默认 false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: "./.eslintrc-auto-import.json", // 默认 "./.eslintrc-auto-import.json"
          globalsPropValue: true // 默认 true (true | false | "readonly" | "readable" | "writable" | "writeable")
        }
        /** 根据自动按需导入的相关 API，生成 .eslintrc-auto-import.json 文件供 Eslint 识别 */
        // dts: "auto-imports.d.ts"
      }),
      viteMockServe({
        mockPath: "./mock",
        supportTs: true,
        localEnabled: Boolean(loadEnv(configEnv.mode, process.cwd()).VITE_MOCK), // 开发环境是否启用mock
        logger: true, // 控制台输出请求日志
        watchFiles: true
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/element.scss" as *;
            @use 'yj-plus/theme-chalk/src/index.scss';
            @use '@/styles/yjplus.scss';
            ` // 路径根据配置改变，没有别名就用相对路径和绝对路径
        }
      }
    },
    server: {
      https: false,
      host: true, // host: "0.0.0.0"
      port: 8083,
      open: false,
      cors: true,
      strictPort: false,
      proxy: {
        "/dev-api": {
          target: "https://access.yunjingtai2.com/stage-api", // 2.1 测试
          changeOrigin: true,
          rewrite: (path) => path.replace("/dev-api", "")
        }
      }
    }
  }
}
