import Axios from 'axios';
import { baseUrl, headersTokenKey, isProd, javascriptChannelName } from '@/config';
import { Toast } from 'vant';
import store from '@/store'
const axios = Axios.create({
  baseURL: isProd ? baseUrl : '/proxy', // 本地开发环境下设置代理
  headers: {'Content-Type': 'application/json'}
});

// 请求拦截器
axios.interceptors.request.use((config) => {
  if (store.getters.token) {
    // console.log(store.getters.token)
    config.headers[headersTokenKey] = store.getters.token
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log('response', response)
    let token = response.headers[headersTokenKey]
    if (token) {
      console.log('更新token', token)
      store.commit('SET_TOKEN', token)
    }
    if (response.status === 200 && response.data) {
      let res = response.data
      if (res.resCode === '00000') {
        return res
      } else {
        Toast(res.resInfo)
        if (res.resCode === '40001') { // token过期
          store.commit('SET_TOKEN', '') // 清空token
          store.commit('SET_USER_INFO', {}) // 清空用户信息
          window[javascriptChannelName].postMessage(JSON.stringify({ method: 'CLEAR_USER_INFO' }))
          window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        }
        return Promise.reject(res)
      }
    } else {
      Toast(response.status)
      return Promise.reject(response.status)
    }
  }, 
  (error) => {
    console.log('error', error)
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('请求超时', error.code, error.message)
      Toast("请求超时")
      return Promise.reject('请求超时')
    } else {
      if (error.response) {
        Toast(error.response.data.message)
        return Promise.reject(error.response.data.message)
      } else {
        Toast('网络错误，请稍后重试')
        return Promise.reject('网络错误，请稍后重试')
      }
    }
  }
);

export default axios
  