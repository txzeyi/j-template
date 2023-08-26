import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
// import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { getToken, removeToken, setToken, setUserInfo } from "@/utils/auth"
import router, { resetRouter } from "@/router"
import type { RouteRecordRaw } from "vue-router"
import { usePermissionStore } from "./permission"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData?: any) => {
    return new Promise((resolve, reject) => {
      // fetchAccount({
      //   phone: "17777370701",
      //   password: "123456789"
      // })
      //   .then((res: any) => {
      //     const { data } = res
      //     setToken(data.token)
      //     token.value = data.token
      //     setUserInfo(data)
      //     return fetchGetChildToken({ token: data.token }, { systemId: data.systemId, tenantId: data.tenantId })
      //   })
      //   .then((res: any) => {
      //     const { data } = res
      //     console.log(data)
      //     setToken(data.token)
      //     token.value = data.token
      //     setUserInfo(data)
      //     resolve(true)
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   })
      resolve(true)
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      roles.value = ["admin"]
      resolve(true)
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    const permissionStore = usePermissionStore()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    location.href = import.meta.env.VITE_PARENT_COMPANY
    // router.push("/login")
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return { token, roles, setRoles, login, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
