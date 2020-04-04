const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  FullName: state => state.user.FullName,
  userid: state => state.user.userid,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission: state => state.user.permission,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
