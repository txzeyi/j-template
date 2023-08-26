<script lang="ts" setup>
import { computed } from "vue"
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue"
import type { PropType } from "vue"
import type { RouteRecordRaw } from "vue-router"
import SidebarItemLink from "./SidebarItemLink.vue"
import { isExternal } from "@/utils/validate"
import path from "path-browserify"

const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
    required: true
  },
  isCollapse: {
    type: Boolean,
    default: false
  },
  isFirstLevel: {
    type: Boolean,
    default: true
  },
  basePath: {
    type: String,
    default: ""
  },
  active:{
    type:Boolean,
    default:false
  }
})

const alwaysShowRootMenu = computed(() => {
  return props.item.meta && props.item.meta.alwaysShow
})

const showingChildNumber = computed(() => {
  if (props.item.children) {
    const showingChildren = props.item.children.filter((item) => {
      return !(item.meta && item.meta.hidden)
    })
    return showingChildren.length
  }
  return 0
})

const theOnlyOneChild = computed(() => {
  if (showingChildNumber.value > 1) {
    return null
  }
  if (props.item.children) {
    for (const child of props.item.children) {
      if (!child.meta || !child.meta.hidden) {
        return child
      }
    }
  }
  // If there is no children, return itself with path removed,
  // because this.basePath already contains item's path information
  return { ...props.item, path: "" }
})

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}
</script>

<template>
  <div v-if="!props.item.meta?.hidden" :class="{ 'simple-mode': props.isCollapse, 'first-level': props.isFirstLevel ,'is-active':props.active}">
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
      <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
          <i
            v-if="theOnlyOneChild.meta.icon"
            class="iconfont mr-8px !text-gray-700"
            :class="theOnlyOneChild.meta?.icon?.startsWith('YJSHHT') ? theOnlyOneChild.meta?.icon : `YJSHHT-${theOnlyOneChild.meta?.icon}`"
          />
          <template v-if="theOnlyOneChild.meta.title" #title>{{ theOnlyOneChild.meta.title }} </template>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(props.item.path)" :expand-close-icon="ArrowDownBold" :expand-open-icon="ArrowUpBold">
      <template #title>
        <i
          v-if="props.item.meta && props.item.meta.icon"
          class="iconfont mr-8px !text-gray-700"
          :class="props.item.meta?.icon?.startsWith('YJSHHT') ? props.item.meta.icon : `YJSHHT-${props.item?.meta?.icon}`"
        />
        <span v-if="props.item.meta && props.item.meta.title">{{ props.item.meta.title }}</span>
      </template>
      <template v-if="props.item.children">
        <sidebar-item
          v-for="child in props.item.children"
          :key="child.path"
          :item="child"
          :is-collapse="props.isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 20px;
  min-width: 1em;
  font-size: 16px;
}

.simple-mode {
  &.first-level {
    ::v-deep(.el-sub-menu) {
      .el-sub-menu__icon-arrow {
        display: none;
      }
      span {
        visibility: hidden;
      }
    }
  }
}
</style>
<style lang="scss">

.el-sub-menu.is-active{
  .el-sub-menu__title{
    font-weight:bold;
    color:#ff8909 !important;
  }
}</style>
