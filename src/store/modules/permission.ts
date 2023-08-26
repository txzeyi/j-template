import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import type { RouteRecordRaw } from "vue-router"
import { constantRoutes, asyncRoutes, errorRoutes } from "@/router"

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return route.meta?.roles?.includes(role)
      }
      return false
    })
  }
  return true
}

// 路由数据组装
const filterAsyncRoutes = async (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []

  // 递归过滤路由权限
  routes.forEach((route) => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })

  // 动态路由
  // const { menuList, getMenuList } = useStore("menu")
  // // 如果菜单值是空的，旧获取一次,否则就使用历史记录
  // if (!menuList.value?.length) {
  //   await getMenuList()
  // }

  // console.log(menuList.value, "菜单列表")
  // menuList.value.forEach((ele: any) => {
  //   // 找到对应的菜单
  //   const route = asyncRoutes.find((e) => e.path === ele.path)
  //   if (route) {
  //     if (!route.meta) {
  //       route.meta = {}
  //     }

  //     // 更改title,如果是函数title,不采用设置的title
  //     route.meta.title = typeof route.meta?.title === "function" ? route.meta.title : ele.label || route.meta?.title
  //     route.meta.icon = ele.meta?.icon || route.meta?.icon
  //     route.meta.hidden = ele.hidden

  //     if (!ele.children) {
  //       res.push(route)
  //     } else {
  //       // 有子级
  //       const children: RouteRecordRaw[] = []
  //       ele.children.forEach((el: any) => {
  //         const item = route.children?.find((e) => route.path + "/" + e.path === el.path)
  //         if (item) {
  //           if (!item.meta) {
  //             item.meta = {}
  //           }
  //           // 更改title,如果是函数title,不采用设置的title
  //           item.meta.title = typeof item.meta?.title === "function" ? item.meta.title : el.label || item.meta?.title
  //           item.meta.icon = el.meta?.icon || item.meta?.icon
  //           item.meta.hidden = ele.hidden
  //           children.push(item)
  //         }
  //       })

  //       route.children = children

  //       res.push(route)
  //     }
  //   }
  // })

  return res
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  const setRoutes = async (roles: string[]) => {
    // 使用动态路由
    // let accessedRoutes = await filterAsyncRoutes(asyncRoutes, roles)

    // 不使用动态路由(直接拼接所有路由)
    let accessedRoutes = asyncRoutes

    // 拼接错误页面
    accessedRoutes = accessedRoutes.concat(errorRoutes)

    routes.value = accessedRoutes.concat(constantRoutes)

    dynamicRoutes.value = accessedRoutes
  }

  return { routes, dynamicRoutes, setRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
