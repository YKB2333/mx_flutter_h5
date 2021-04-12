const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  platformInfo: state => state.app.platformInfo
}
export default getters
