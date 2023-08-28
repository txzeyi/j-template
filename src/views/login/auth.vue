<template>
  <div>
    <div class="loader">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { authToken } from "@/service"
import { setToken, setUserInfo } from "@/utils/auth"
const route = useRoute()
const router = useRouter()

const token = ref(((route.query?.token ?? "") as string).replace(/\s/g, "+"))
const systemId = ref(route.query?.s)
const tenantId = ref(route.query?.t)

if (!token.value) {
  ElMessage.error("非法访问！")
  setTimeout(() => {
    window.opener = null
    window.open("about:blank", "_top")?.close
  }, 2000)
} else {
  // 解析token
  authToken({ systemType: 0, token: token.value }, { systemId: systemId.value, tenantId: tenantId.value }).then(
    async (res: any) => {
      const userInfo = res.data
      setToken(userInfo.token)
      setUserInfo(userInfo)

      ElMessage.success("登录成功")
      router.replace("/commodity/goods")
    },
    () => {
      setTimeout(() => {
        window.opener = null
        window.open("about:blank", "_top")?.close()
      }, 2000)
    }
  )
}
</script>

<style scoped lang="scss">
$color-background: #eaecfa;
$color-loader: #ff8909;

body {
  background: $color-background;
}

.loader {
  width: 250px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: helvetica, arial, sans-serif;
  text-transform: uppercase;
  font-weight: 900;
  color: $color-loader;
  letter-spacing: 0.2em;

  &::before,
  &::after {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    background: $color-loader;
    position: absolute;
    animation: load 0.7s infinite alternate ease-in-out;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
}

@keyframes load {
  0% {
    left: 0;
    height: 30px;
    width: 15px;
  }
  50% {
    height: 8px;
    width: 40px;
  }
  100% {
    left: 235px;
    height: 30px;
    width: 15px;
  }
}
</style>
