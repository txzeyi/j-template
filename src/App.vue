<script lang="ts" setup>
import zhCn from "element-plus/es/locale/lang/zh-cn"

import "element-plus/theme-chalk/el-loading.css"
import "element-plus/theme-chalk/el-message.css"

zhCn.el.pagination.goto = "跳至"
zhCn.el.pagination.total = "共{total}条记录"
zhCn.el.datepicker.weeks = {
  sun: "周日",
  mon: "周一",
  tue: "周二",
  wed: "周三",
  thu: "周四",
  fri: "周五",
  sat: "周六"
}
const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale" size="large" :message="{ max: 5 }">
    <router-view />
  </el-config-provider>
</template>

<style lang="scss"></style>
