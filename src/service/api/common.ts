import { request } from "../request"

/**
 * mockGetDemo
 * @description request
 * @param {string} phone - 手机号
 * @returns
 */
export const featGetDemo = (phone: string) => request.get("/login", { phone, method: "GET" })

/**
 * authToken
 * @description request
 */
export const authToken = () => request.get("/auth/token", { method: "GET" })

/**
 * 系统信息
 * @description request
 */
export const fetchGetSetInfo = () => request.get("/system/info", { method: "GET" })
