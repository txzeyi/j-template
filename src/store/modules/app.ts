import { reactive, ref } from "vue"
import { defineStore } from "pinia"
import { getSidebarStatus, getActiveThemeName, setSidebarStatus, setActiveThemeName } from "@/utils/cache/localStorage"
import type { ThemeName } from "@/config/theme"

export enum DeviceType {
  Mobile,
  Desktop
}

interface ISidebar {
  opened: boolean
  withoutAnimation: boolean
}

const setClassName = (value: ThemeName) => {
  document.documentElement.className = value
}

export const useAppStore = defineStore("app", () => {
  const sidebar: ISidebar = reactive({
    opened: getSidebarStatus() !== "closed",
    withoutAnimation: false
  })
  const device = ref<DeviceType>(DeviceType.Desktop)
  const activeThemeName = ref<ThemeName>(getActiveThemeName() || "normal") // 正在应用的主题的名字

  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
    if (sidebar.opened) {
      setSidebarStatus("opened")
    } else {
      setSidebarStatus("closed")
    }
  }
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus("closed")
  }
  const toggleDevice = (value: DeviceType) => {
    device.value = value
  }
  const setTheme = (value: ThemeName) => {
    activeThemeName.value = value
    setClassName(activeThemeName.value) // 应用到 Dom
    setActiveThemeName(activeThemeName.value) // 持久化
  }
  const initTheme = () => {
    setClassName(activeThemeName.value) // 初始化
  }

  return { device, sidebar, activeThemeName, toggleSidebar, closeSidebar, toggleDevice, setTheme, initTheme }
})
