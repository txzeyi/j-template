import { createRouter, createWebHashHistory, createWebHistory, RouteLocationMatched, useRouter } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
const Layout = () => import("@/layout/index.vue")

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    meta: { title: "条码中心", icon: "YJSHHT-a-18gongzuotai", affix: true },
    redirect: { name: "home" },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/barcodes/home/index.vue"),
        meta: { title: "条码管理" }
      },
      {
        path: "codeBin",
        name: "codeBin",
        component: () => import("@/views/barcodes/codeBin/index.vue"),
        meta: { title: "码仓管理" }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    meta: { title: "系统设置", icon: "YJSHHT-a-18gongzuotai", affix: true },
    redirect: { name: "user" },
    children: [
      {
        path: "user",
        name: "user",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "角色管理" }
      },
      {
        path: "relation",
        name: "relation",
        component: () => import("@/views/system/relation/index.vue"),
        meta: { title: "关联系统" }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    meta: { hidden: true },
    redirect: { name: "Dashboard" }
  },
  // 鉴权登陆页面
  {
    path: "/auth",
    component: () => import("@/views/login/auth.vue"),
    meta: { hidden: true }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  }
]

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*", // 必须将 'ErrorPage' 路由放在最后, Must put the 'ErrorPage' route at the end
    component: Layout,
    redirect: "/404",
    name: "ErrorPage",
    meta: { title: "错误页面", icon: "404", hidden: true },
    children: [
      {
        path: "403",
        component: () => import("@/views/error-page/403.vue"),
        name: "403",
        meta: { title: "403" }
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        name: "404",
        meta: { title: "404" }
      }
    ]
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: asyncRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
