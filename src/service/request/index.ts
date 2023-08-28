import { createRequest } from "./request"
import type { AxiosRequestConfig } from "axios"

export const baseUrl = import.meta.env.VITE_APP_WEB_URL || "/prod-api/"

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === "Y"

export const request = createRequest({ baseURL: baseUrl, timeout: 500000 })

export const apiRequest = createRequest({ baseURL: isHttpProxy ? "/api" : "" })

export const mockRequest = createRequest({ baseURL: "/mock" })

export const uploadRequest = createRequest({
  baseURL: baseUrl,
  timeout: 500000,
  headers: {
    ContentType: "multipart/form-data"
  }
})

export const customRequest = (options: AxiosRequestConfig) =>
  createRequest({
    baseURL: baseUrl,
    timeout: 500000,
    headers: {
      ContentType: "multipart/form-data"
    },
    ...options
  })
