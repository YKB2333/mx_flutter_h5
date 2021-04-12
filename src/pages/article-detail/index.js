
import Vue from 'vue'
import App from './index.vue'
import store from '@/store'
import '../common.js'
import { Button, Image as VanImage, Loading, List, Popup, Field } from 'vant';
import VideoPlayer from 'vue-video-player'

// 有赞组件
Vue.use(Button).use(VanImage).use(Loading).use(List).use(Popup).use(Field);

// 视频播放插件
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')