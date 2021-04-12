
import { projectKey } from '@/config'
let store = require('store')

export default {
  state: {
    token: store.get(`${projectKey}_token`) || '',
    userInfo: store.get(`${projectKey}_user_info`) || {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token || ''
      store.set(`${projectKey}_token`, state.token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo || {}
      store.set(`${projectKey}_user_info`, state.userInfo)
    }
  },
  actions: {
  }
}