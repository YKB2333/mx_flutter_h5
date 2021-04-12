import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user from './modules/user'
import app from './modules/app'
import getters from './getters'

// 导出 store 对象
export default new Vuex.Store({
  getters,
  modules: {
    user,
    app
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
