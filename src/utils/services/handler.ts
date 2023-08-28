import whiteCode from "@/service/request/whiteCode"
/** 统一失败和成功的请求结果的数据类型 */
export async function handleServiceResult<T = any>(error: Service.RequestError | null, data: any) {
  // if (error) {
  //   const fail: Service.FailedResult = { error, data: null }
  //   return fail
  // }
  // const success: Service.SuccessResult<T> = { error: null, data }
  // return success

  if (data && whiteCode.includes(data.code)) {
    return Promise.resolve(data as Service.SuccessResult<T>)
  } else if (error) {
    return Promise.reject(error as Service.FailedResult)
  }
}

/** 请求结果的适配器：用于接收适配器函数和请求结果 */
export function adapter<T extends Service.ServiceAdapter>(
  adapterFun: T,
  ...args: Service.MultiRequestResult<TypeUtil.GetFunArgs<T>>
): Service.RequestResult<ReturnType<T>> {
  let result: Service.RequestResult | undefined

  const hasError = args.some((item: any) => {
    const flag = Boolean(item.error)
    if (flag) {
      result = { error: item.error, data: null }
    }
    return flag
  })

  if (!hasError) {
    const adapterFunArgs = args.map((item) => item.data)
    result = { error: null, data: adapterFun(...adapterFunArgs) }
  }

  return result!
}
