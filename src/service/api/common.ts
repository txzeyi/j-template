import { mockRequest } from "../request"

/**
 * mockGetDemo
 * @description MockRequest
 * @param {string} phone - 手机号
 * @returns
 */
export const featGetDemo = (phone: string) => mockRequest.get("/login", { phone, method: "GET" })

/**
 * authToken
 * @description MockRequest
 */
export const authToken = () => mockRequest.get("/auth/token", { method: "GET" })
