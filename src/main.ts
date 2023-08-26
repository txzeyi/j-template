import { createApp } from "vue"
import store from "./store"
import router from "./router"
import "@/router/permission"
import * as directives from "@/directives"
import type { Directive } from "vue"
import App from "./App.vue"

import "normalize.css"
import "@/assets/font/alibaba/font.scss"
import "@/assets/font/iconfont.css"
import "uno.css"
import "@/styles/index.scss"

/** 云镜UI */
import YjPlus from "yj-plus"

const app = createApp(App)
/** 自定义指令 */
Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})
app.use(YjPlus).use(store).use(router)
app.mount("#app")
