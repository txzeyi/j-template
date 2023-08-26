<template>
  <div class="flex flex-col flex-center h-full" style="height: calc(100vh - 86px)">
    <el-image :src="errorImg" class="w-300px"></el-image>
    <p class="font-bold text-3xl my-8">404</p>
    <p class="text-gray-400 text-lg">很抱歉，页面他一不小心迷路了～</p>
    <el-button @click="toHome" class="mt-4">返回首页</el-button>
  </div>
</template>
<script lang="ts" setup>
import errorImg from "@/assets/image/error.png"
import { useRouter } from "vue-router"
const router = useRouter()

const toHome = () => {
  router.push({ path: "/dashboard" })
}
</script>
