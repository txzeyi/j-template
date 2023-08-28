// import { getUserInfo } from "@/service"
import { removeToken } from "@/utils/auth"

export default defineStore({
  id: "userInfo",
  state: (): any => {
    return {
      userInfo: {}
    }
  },
  actions: {
    setUserInfo(userInfo: any) {
      Object.assign(this.userInfo, userInfo)
    },
    async getInfo() {
      // await getUserInfo().then((res: any) => {
      //   this.setUserInfo(res.data)
      // })
      this.setUserInfo({})
    },
    logout() {
      removeToken()
      location.href = import.meta.env.VITE_PARENT_COMPANY
    }
  }
})
