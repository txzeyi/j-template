/** 布局配置 */
interface ILayoutSettings {
  showSettings: boolean // 是否显示 Settings Panel
  showTagsView: boolean // 是否显示标签栏
  showSidebarLogo: boolean // 是否显示侧边栏 Logo
  fixedHeader: boolean // 是否固定 Header
  showThemeSwitch: boolean // 是否显示切换主题按钮
  showScreenfull: boolean // 是否显示全屏按钮
}

const layoutSettings: ILayoutSettings = {
  showSettings: true,
  showTagsView: false,
  fixedHeader: true,
  showSidebarLogo: true,
  showThemeSwitch: true,
  showScreenfull: true
}

export default layoutSettings
