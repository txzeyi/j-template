import type { AxiosRequestConfig } from "axios"

// import { getRefreshToken, setRefreshToken, setToken } from "@/utils/auth"

/**
 * 刷新token
 * @param axiosConfig - token失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  console.log(axiosConfig)
  const { logout } = useStore("userInfo")
  logout()

  // const { resetAuthStore, logout } = useUserStoreHook()
  // const refreshToken = getRefreshToken()
  // // const { data } = await fetchUpdateToken(refreshToken);
  // const { data } = { data: { token: "", refreshToken: "" } }
  // if (data) {
  //   setToken(data.token)
  //   setRefreshToken(data.refreshToken)
  //   logout()
  //   const config = { ...axiosConfig }
  //   if (config.headers) {
  //     config.headers.Authorization = data.token
  //   }
  //   return config
  // }

  // // resetAuthStore()
  // return null
}
