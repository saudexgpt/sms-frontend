const getters = {
  windowBreakPoint: state => {
    // This should be same as tailwind. So, it stays in sync with tailwind utility classes
    if (state.windowWidth >= 1200) {
      return 'xl'
    } if (state.windowWidth >= 992) {
      return 'lg'
    } if (state.windowWidth >= 768) {
      return 'md'
    } if (state.windowWidth >= 576) {
      return 'sm'
    }
    return 'xs'
  },

  scrollbarTag: state => (state.is_touch_device ? 'div' : 'VuePerfectScrollbar'),
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userData: state => state.user.userData,
  userId: state => state.user.id,
  permissionRoutes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  baseServerUrl: state => state.app.baseServerUrl,
  token: state => state.user.token,
  necessaryParams: state => state.app.params,
//   sidebar: state => state.app.sidebar,
//   language: state => state.app.language,
//   size: state => state.app.size,
//   device: state => state.app.device,
//   visitedViews: state => state.tagsView.visitedViews,
//   cachedViews: state => state.tagsView.cachedViews,
//   userId: state => state.AppActiveUser.id,
//   token: state => state.AppActiveUser.token,
//   avatar: state => state.AppActiveUser.avatar,
//   name: state => state.AppActiveUser.name,
//   introduction: state => state.AppActiveUser.introduction,
//   roles: state => state.AppActiveUser.roles,
//   permissions: state => state.AppActiveUser.permissions,
//   permissionRoutes: state => state.permission.routes,
//   addRoutes: state => state.permission.addRoutes
}
export default getters
