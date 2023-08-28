import { fetchGetSetInfo } from "@/service"

export default defineStore({
  id: "system",
  state: (): any => {
    return {
      info: {},
      collectionAccount: {},
      menuList: null,
      systemNoticeTimer: null
    }
  },
  actions: {
    async initSystem() {
      await fetchGetSetInfo().then((res: any) => {
        this.info = res.data
      })
    },
    setSystemNoticeTimer(state: any) {
      this.systemNoticeTimer = state
    }
  }
  // persist: {
  // enabled: true
  // strategies: [{ key: "SYSTEM_INFO", storage: sessionStorage }]
  // }
})
