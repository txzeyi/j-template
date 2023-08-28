<script lang="ts" setup>
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { ArrowDown } from "@element-plus/icons-vue"
import Breadcrumb from "../Breadcrumb/index.vue"

const router = useRouter()
const userStore = useUserStore()
const { info, initSystem } = useStore("system")

const logout = () => {
  userStore.logout()
  router.push("/login")
}

initSystem()
</script>

<template>
  <div class="navigation-bar">
    <Breadcrumb class="breadcrumb" />
    <div class="right-menu mr-24px">
      <!-- <Screenfull v-if="showScreenfull" class="right-menu-item" /> -->
      <!-- <ThemeSwitch v-if="showThemeSwitch" class="right-menu-item" /> -->
      <el-dropdown class="right-menu-item boxShadow rounded-lg">
        <div class="flex-center min-w-150px bg-white rounded-md justify-between leading-36px">
          <!-- <el-avatar shape="square" :icon="UserFilled" :size="36" /> -->
          <div class="name px-3">{{ info.systemName }}</div>
          <el-icon class="el-icon--right el-icon--left"><arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">
              <span style="display: block">个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation-bar {
  height: var(--v3-navigationbar-height);
  overflow: hidden;
  // background: #fff;
  .breadcrumb {
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    color: #606266;
    .right-menu-item {
      cursor: pointer;
    }
  }
}
</style>
