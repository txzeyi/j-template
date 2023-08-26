<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const key = computed(() => {
  return route.path + JSON.stringify(route.query)
})
</script>

<template>
  <section class="app-main">
    <el-scrollbar class="h-full px-6">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <!-- <keep-alive> -->
          <!-- :key="key" -->
          <component :is="Component" :key="key" />

          <!-- </keep-alive> -->
        </transition>
      </router-view>
    </el-scrollbar>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - var(--v3-navigationbar-height) - 8px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: var(--v3-navigationbar-height);
  // padding-left: 24px;
  // padding-right: 24px;
  // padding-bottom: 24px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - (var(--v3-header-height) + 8px));
  }
  .fixed-header + .app-main {
    padding-top: var(--v3-header-height);
  }
  .app-container {
    padding-top: 12px;
  }
}
</style>
