import Vue from 'vue'
import "normalize.css"
import "@/assets/style/index.scss"
import 'lib-flexible/flexible'
import store from '@/store'
import loading from '@/components/loading/index.js' // 引入loading
import { isEmpty } from '@/utils'
import * as filters from '@/filters'
import { Toast } from 'vant';
import { onlyApp, isProd, userAgent, errorPage } from '@/config'

if (onlyApp && isProd && !navigator.userAgent.includes(userAgent) ) {
  // 生产环境下，如果不是app环境打开，跳转到error页面
  window.location.href = errorPage
} else {
  
  Vue.use(Toast)
  
  Vue.use(loading)
  
  // 注册全局指令
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
  
  Vue.prototype.$showLoading = (text = '加载中') => Toast.loading({ message: text, forbidClick: true, duration: 0 })
  Vue.prototype.$hideLoading = () => Toast.clear()

  window.getAppData = (jsonStr) => {
    let data = JSON.parse(jsonStr)
    // token
    store.commit('SET_TOKEN', data['token'])

    // 用户信息
    store.commit('SET_USER_INFO', data['userInfo'])

    // 设备信息
    store.commit('SET_PLATFORM_INFO', data['platformInfo'])
  }

}

