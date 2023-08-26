/** http请求头的content-type类型 */
export enum EnumContentType {
  json = "application/json",
  formData = "multipart/form-data",
  formUrlencoded = "application/json;charset=UTF-8"
}
/** 缓存的key */
export enum EnumStorageKey {
  "token" = "__TOKEN__", // 用户token
  "user-info" = "__USER_INFO__", // 用户信息
  "theme-color" = "__THEME_COLOR__", // 主题颜色
  "refresh-token" = "__REFRESH_TOKEN__", // 用户刷新token
  "theme-settings" = "__THEME_SETTINGS__", // 主题配置
  "multi-tab-routes" = "__MULTI_TAB_ROUTES__" // 多页签路由信息
}

/** 数据类型 */
export enum EnumDataType {
  set = "[object Set]",
  map = "[object Map]",
  null = "[object Null]",
  date = "[object Date]",
  file = "[object File]",
  array = "[object Array]",
  number = "[object Number]",
  string = "[object String]",
  object = "[object Object]",
  regexp = "[object RegExp]",
  boolean = "[object Boolean]",
  undefined = "[object Undefined]"
}

/** 用户角色 */
export enum EnumUserRole {
  user = "普通用户",
  admin = "管理员",
  super = "超级管理员"
}
