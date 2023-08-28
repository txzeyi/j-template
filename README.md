# YJ template

## 项目介绍

YJ 后台系统模板

## 安装使用

- 环境配置
  **本地环境需要安装 pnpm 7.x 、Node.js 14.18+ 和 Git**

- 克隆代码

```bash
git clone **
```

- 安装依赖

```bash
pnpm i
```

- 运行

```bash
pnpm dev
```

- 打包

```bash
pnpm build
or # 生成环境
pnpm build:prod
```

## 项目结构

    ```
    yj-admin
    ├── mock                       // 项目mock 模拟数据
    ├── src                        // 源代码
    │   ├── assets                 // 主题 字体等静态资源
    │   ├── components             // 全局公用组件
    |   |   ├── business           // 业务组件
    |   |   ├── common             // 基础组件
    |   |   ├── costom             // 公共组件
    │   ├── directive              // 全局指令
    |   ├── enum                   // 枚举
    │   ├── service                // 所有请求
    │   ├── store                  // 全局 store管理
    │   ├── utils                  // 全局公用方法
    │   ├── views                  // views 所有页面
    │   ├── App.vue                // 入口页面
    │   ├── main.js                // 入口 加载组件 初始化等
    ```

## Git 贡献提交规范

项目已经内置 Angular 提交规范，直接执行 commit 命令即可生成符合 Angular 提交规范的 commit。
