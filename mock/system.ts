export const systemInfo = {
  "id|1-10086": 1,
  systemName: "@cword(1,20)",
  systemId: "@natural(10000000,9999999999999)", // 系统id
  createTime: "@datetime",
  updateTime: "@datetime",
  remark: "@cparagraph", // 备注
  "systemType|0-1": 1,
  manager: "@natural(10000000000,19999999999)",
  appUrl: "@url",
  pcUrl: "@url",
  thirdId: "@natural(1,1000)",
  collectionAccountId: /^\d{0,1}$/,
  phone: /^(?:(?:\+|00)86)?1\d{10}$/,
  status: "@integer(0,1)",
  accountAlias: "@province@city@county@cword(1,10)",
  openBankName: "@cword(1,10)",
  cardNo: /^[1-9]\d{9,29}$/, // 开户卡号
  accountInfo: "@province@city@county@cword(1,10)" // 账户信息
}
const fetchGetSetInfo = {
  url: "/dev-api/system/info",
  method: "get",
  response: () => {
    return {
      code: 200,
      msg: "@cword(5)",
      data: systemInfo
    }
  }
}

export default [fetchGetSetInfo]
