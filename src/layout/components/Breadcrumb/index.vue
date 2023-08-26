<script lang="ts" setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ArrowRight } from "@element-plus/icons-vue"
import type { RouteLocationMatched } from "vue-router"
import { compile } from "path-to-regexp"

const route = useRoute()
const router = useRouter()

const breadcrumbs = ref<RouteLocationMatched[]>([])

const getBreadcrumb = () => {
  breadcrumbs.value = route.matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

const pathCompile = (path: string) => {
  const { params } = route
  const toPath = compile(path)
  return toPath(params)
}

const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(pathCompile(path))
}

watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return
    }
    getBreadcrumb()
  }
)

getBreadcrumb()
</script>

<template>
  <el-breadcrumb class="app-breadcrumb flex" :separator-icon="ArrowRight">
    <h2 class="m-0 float-left mr-4 text-22px font-bold">
      {{
        typeof breadcrumbs[breadcrumbs.length - 1].meta.title == "function"
          ? breadcrumbs[breadcrumbs.length - 1].meta?.title?.()
          : breadcrumbs[breadcrumbs.length - 1].meta.title
      }}
    </h2>
    <template v-if="breadcrumbs.length > 1">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1" class="no-redirect">
          {{ typeof item.meta.title === "function" ? item.meta.title() : item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ typeof item.meta.title === "function" ? item.meta.title() : item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a,
.el-breadcrumb__inner span {
  font-weight: 400 !important;
  font-size: var(--el-font-size-base);
}

.app-breadcrumb.el-breadcrumb {
  line-height: var(--v3-navigationbar-height);
  margin-left: 24px;
  .no-redirect {
    cursor: text;
  }
}
</style>
