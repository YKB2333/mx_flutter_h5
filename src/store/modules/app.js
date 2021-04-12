export default {
  state: {
    platformInfo: {
      'statusBarHeight': 0,
      'bottomBarHeight': 0,
      'isAndroid': false,
      'isIOS': false
    }
  },
  mutations: {
    SET_PLATFORM_INFO(state, platformInfo) {
      state.platformInfo = platformInfo || {}
    }
  },
  actions: {
  }
}