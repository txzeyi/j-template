/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   * - custom: 自定义角色
   */
  type RoleType = keyof typeof import('@/enum').EnumUserRole;

  /** 用户信息 */
  interface UserInfo {
    userId: string; //用户id
    userName: string; // 用户名
    userRole: RoleType; // 用户角色类型
    firstLogin:Boolean;
    ipaddr: string;
    loginTime: string;
    nickName: string;
    systemId: string;
    tenantId: string;
    tenantName: string;
    tenantSource: string;
  }
}

declare namespace Demo {
  interface DataWithAdapter {
    id: string;
    name: string;
  }
}

/** 系统消息 */
declare namespace Message {
  interface Tab {
    key: number; // tab的key
    name: string; // tab名称
    badgeProps?: import('naive-ui').BadgeProps; // badge类型
    list: List[]; // 消息数据
  }

  interface List {
    id: number; // 数据唯一值
    avatar?: string; // 头像
    icon?: string; // 消息icon
    svgIcon?: string;
    title: string; // 消息标题
    date?: string; // 消息发送时间
    isRead?: boolean; // 消息是否已读
    description?: string; // 消息描述
    tagTitle?: string;//  标签名称
    tagProps?: import('naive-ui').TagProps; // 标签props
  }
}

/** 用户管理 */
declare namespace UserManagement {
  /** 用户表格 */
  interface UserTable {
    index: number; // 序号
    key: string; // 数据的key(id)
    id: string; // 用户id
    userName: string; // 用户名
    userAge: string; // 用户年龄
    userGender: keyof typeof import('@/enum').EnumGender; // 用户性别 - male 男 - female 女
    userGenderLabel: import('@/enum').EnumGender;
    userPhone: string; // 用户手机号
    userEmail: string; // 用户邮箱
    userRole: Auth.RoleType; // 用户角色
    disabled: boolean; // 是否禁用用户
  }
}

