<template>
  <div style="height: 100vh;" class="col">
    <!-- appbar -->
    <div class="app-bar" :class="{'bg-white shadow': appBar === 1}" :style="{ '--statusbar': platformInfo.statusBarHeight }">
      <div class="row space-between center-y">
        <div class="plr10" @click="onBack">
          <van-image v-show="appBar === 0" class="w30" :src="require('_images/icon_back_round.png')" />
          <van-image v-show="appBar === 1" class="w10" :src="require('_images/icon_back.png')" />
        </div>
        <div class="plr10" @click="toCart">
          <cart-icon v-show="appBar === 0" img-class="w30" :icon="require('_images/icon_cart_round.png')" :count="cartCount" />
          <cart-icon v-show="appBar === 1" img-class="w24" :icon="require('_images/icon_cart.png')" :count="cartCount" />
        </div>
      </div>
    </div>

    <div class="flex-1 scroll-y" ref="scroll-box" @scroll="onScroll">
      <!-- 轮播 -->
      <div class="full-vw">
        <!-- <van-swipe :autoplay="4000" v-if="type === 0">
          <van-swipe-item v-for="(url, index) in swipeList" :key="url">
            <van-image fit="cover" :src='url' class="full-vw" @click="onImagePreview(index)" />
          </van-swipe-item>
        </van-swipe> -->
        <swiper v-if="type === 0" :options="swiperOptions">
          <swiper-slide v-for="(url, index) in swipeList" :key="index">
            <img :src='url' class="full-vw cover" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <video-player 
          v-if="type === 1" 
          class="video full-vw"
          :playsinline="true"
          :options="playerOptions"
        />
      </div>
      <div class="ptb20 plr16">
        <div class="fs-lg-big fw700">{{ articleName }}</div>
        <div class="mt20 row space-between center-y">
          <div class="row">
            <van-image fit="cover" round class="w-h40" :src="authorAvatar || require('_images/avatar_default.png')" />
            <div class="col space-around fs-mini ml10">
              <span>{{ authorName }}</span>
              <span class="color-gray" v-if="createTime">{{ createTime | formatDateStr }}</span>
            </div>
          </div>
          <div>
            <van-button :loading="loadingFocus" round class="h30 l-h30" v-show="!isFocus" @click="onFocus(1)">关注</van-button>
            <van-button :loading="loadingFocus" round color="#F3F4FD" class="h30 l-h30 focus-btn" v-show="isFocus" @click="onFocus(0)">已关注</van-button>
          </div>
        </div>
        <!-- 商品轮播 -->
        <!-- <template v-if="skuList.length">
          <van-swipe :autoplay="300000" class="mt20 goods-swipe">
            <van-swipe-item v-for="(item, index) in skuList" :key="index">
              <div class="p10 bg-primary row radius" @click="toGoodsDetail(item)">
                <img :src="item.skuImages[0].imgUrl" width="60" height="60" class="radius mr14" />
                <div class="flex-1 col space-between hidden">
                  <div class="ellipsis fs-sm fw600">{{ item.spuName }}</div>
                  <div class="color-gray">{{ item.ownSpec | ownSpec }}</div>
                  <div class="row space-between center-y">
                    <div class="color-red fw600">¥{{ item.salesPrice | formatMoney }}</div>
                    <template v-if="item.status === 1 && item.salesStock > 0">
                      <div v-show="!loadingCart" class="pl20" @click.stop="onAddCart(item)">
                        <img :src="require('_images/icon_cart.png')" width="21" height="20" />
                      </div>
                      <van-loading v-show="loadingCart" size="20" color="#FFD100" />
                    </template>
                    <div v-else>
                      <span v-if="item.status === 0">已下架</span>
                      <span v-else-if="item.salesStock === 0">补货中</span>
                    </div>
                  </div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </template> -->
        <div class="mt20">
          <swiper v-if="skuList.length" :options="swiperOptions2">
            <swiper-slide v-for="(item, index) in skuList" :key="index">
              <div class="p10 bg-primary row radius" @click="toGoodsDetail(item)">
                <img :src="item.skuImages[0].imgUrl" width="60" height="60" class="radius mr14" />
                <div class="flex-1 col space-between hidden">
                  <div class="ellipsis fs-sm fw600">{{ item.spuName }}</div>
                  <div class="color-gray">{{ item.ownSpec | ownSpec }}</div>
                  <div class="row space-between center-y">
                    <div class="color-red fw600">¥{{ item.salesPrice | formatMoney }}</div>
                    <template v-if="item.status === 1 && item.salesStock > 0">
                      <div v-show="!loadingCart" class="pl20" @click.stop="onAddCart(item)">
                        <img :src="require('_images/icon_cart.png')" width="21" height="20" />
                      </div>
                      <van-loading v-show="loadingCart" size="20" color="#FFD100" />
                    </template>
                    <div v-else>
                      <span v-if="item.status === 0">已下架</span>
                      <span v-else-if="item.salesStock === 0">补货中</span>
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination-2 text-center pt10" slot="pagination"></div>
          </swiper>
        </div>
        <!-- 富文本 -->
        <div class="mt20 fs15 rich-text-container">
          <div v-html="content"></div>
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="bg-primary p16" ref="boundary">全部评论({{ totalComments }})</div>
      <div v-if="isCommentListEmpty" class="col center ptb40">
        <img :src="require('_images/empty_comment.png')" width="193" height="129" />
        <div class="mt20 color-gray">快来夸夸TA～</div>
      </div>
      <template v-else>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="已经到底了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          @load="onLoad">
          <div v-for="(item, index) in commentList" :key="index" class="p16 row hairline-bottom">
            <div><van-image round class="w-h30" :src="item.uavatar || require('_images/avatar_default.png')" fit="cover" /></div>
            <div class="flex-1 col ml14">
              <div class="row space-between center-y h30">
                <span class="color-gray">{{ item.uname }}</span>
                <div class="pl16" @click="onZan(item)">
                  <van-image class="w-h16" :src="item.isLike ? require('_images/icon_zan_active.png') : require('_images/icon_zan.png')" fit="cover" />
                </div>
              </div>
              <div class="mtb12">{{ item.content }}</div>
              <div class="color-gray">{{ item.createTime | formatDateStr }}</div>
            </div>
          </div>
        </van-list>
      </template>

    </div>
    <!-- bottomBar -->
    <div class="row plr16 ptb10 center-y shadow" :class="{'pb26': platformInfo.isIOS && platformInfo.bottomBarHeight > 0 }">
      <van-image fit="cover" round class="w-h30" :src="userInfo.headImgUrl || require('_images/avatar_default.png')" />
      <div class="flex-1 color-gray plr14" @click="openPopup(0)">写评论...</div>
      <div class="col" @click="onLikeArticle">
        <van-image width="20" heigth="19" :src="isLike ? require('_images/icon_heart_active.png') : require('_images/icon_heart.png')" />
        <span class="fs-mini text-center mt4">{{ likeNum }}</span>
      </div>
      <div class="col pl20" @click="openPopup(1)">
        <van-image width="20" heigth="19" :src="require('_images/icon_share.png')" />
        <span class="fs-mini text-center mt4">{{ shareNum }}</span>
      </div>
    </div>

    <!-- 评论弹层 -->
    <van-popup
      v-model="popup.show"
      position="bottom"
      :overlay="popup.type !== 2" :class="{'bg-opacity': popup.type === 2 }"
      @click-overlay="onClickOverlay">
      <template v-if="popup.type === 0">
        <div :style="{ 'margin-bottom': keyboardHeight+'px' }">
          <div class="row center-y space-between p16 hairline-bottom">
            <div @click="closePopup(0)">取消</div>
            <van-button :loading="loadingPublish" round class="h30 l-h30 w80" @click="onPublish">发布</van-button>
          </div>
          <div>
            <van-field v-model="value" placeholder="评论..." type="textarea" maxlength="120" rows="4" show-word-limit  ref="field" />
          </div>
        </div>
      </template>
      <template v-if="popup.type === 1">
        <div>
          <div class="hairline-bottom">
            <div class="text-center pt24" v-if="SHARE_THE_INTEGRAL > 0">分享成功后可获得{{ SHARE_THE_INTEGRAL }}积分</div>
            <div class="col center mtb40" @click="onWxShare">
              <img :src="require('_images/icon_wechat.png')" width="36" height="36" />
              <span class="mt10">微信好友</span>
            </div>
          </div>
          <div class="ptb16 text-center" :class="{'pb26': platformInfo.isIOS && platformInfo.bottomBarHeight > 0 }" @click="closePopup(1)">取消</div>
        </div>
      </template>
      <template v-if="popup.type === 2">
        <div class="integral-tips">{{ integralTips.text }}+{{ integralTips.value }}积分</div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import { getArticleDetail, focus, getCommentList, likeArticle, cancelLikeArticle, addComment, likeComment, cancelLikeComment, shareArticle, read } from '@/api/article'
import { getCartList, addCart } from '@/api/order'
import { getSysdictQuery } from '@/api/backstage'
import { wxShare } from '@/api/auth'
import { isEmpty, debounce } from '@/utils'
import CartIcon from '_c/CartIcon'
import { userAgent, javascriptChannelName } from '@/config'
import { mapGetters } from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.min.css'
let vm = null
export default {
  name: "ArticleDetail",
  components: { CartIcon, Swiper, SwiperSlide },
  data() {
    return {
      id: '', // 文章ID
      swipeList: [], // 轮播
      authorAvatar: '', // 用户头像
      articleName: '', // 文章名称
      content: '', // 文章内容富文本
      authorName: '', // 文章作者名称
      createTime: '', // 文章创建时间
      likeNum: 0, // 文章点赞数量
      shareNum: 0, // 文章分享数量
      isFocus: false, // 用户是否关注文章作者
      isLike: false, // 用户是否收藏此文章
      skuList: [], // 商品
      type: 0, // 0图片， 1视频
      playerOptions : {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4",
          src: ''//url地址
        }],
        poster: "", //你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      },
      loadingFocus: false,
      loadingCart: false,
      loadingPublish: false,
      commentList: [], // 评论列表
      totalComments: 0, // 评论总数
      isCommentListEmpty: false,
      loading: false,
      finished: false,
      error: false,
      pageSize: 30,
      pageNo: 1,
      cartCount: 0, // 购物车数量
      value: '', // 评论内容
      // 加积分提示
      integralTips: {
        text: '',
        value: 0
      }, 
      SHARE_THE_INTEGRAL: 0, // 分享文章可获得的积分
      keyboardHeight: 0, // 键盘高度
      appBar: 0,
      stopRead: false,
      // 弹窗
      popup: {
        type: 0, // 0评论 1分享 2加积分提示
        show: false
      },
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          bulletActiveClass: 'bg-theme no-opatity',
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper 
        observeParents: true, //修改swiper的父元素时，自动初始化swiper 
        loop: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 50,
        slidesPerView: 'auto',
        on: {
          click: function() {
            // 这里的this指向的是swiper不是vue，realIndex：索引
            vm.onImagePreview(this.realIndex)
          }
        }
      },
      swiperOptions2: {
        touchStartPreventDefault: true,
        pagination: {
          el: '.swiper-pagination-2',
          bulletActiveClass: 'bg-theme no-opatity',
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper 
        observeParents: true, //修改swiper的父元素时，自动初始化swiper 
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 50,
        slidesPerView: 'auto',
      }
    }
  },
  computed: {
    ...mapGetters(['token', 'userInfo', 'platformInfo']),
  },
  created() {
    console.log('created==============')
    if (navigator.userAgent.includes(userAgent)) {
      window.init = this.init
      window.wxShareArticleCallback = this.wxShareArticleCallback
      window.getkeyboardHeight = this.getkeyboardHeight
    } else {
      // 浏览器测试
      // 178093435471650817
      // 167934736984293377
      // 186569187859312640
      this.init(JSON.stringify({ id: '178093435471650817' }))
    }
    vm = this
  },
  mounted() {
  },
  methods: {
    init(jsonStr) {
      this.id = JSON.parse(jsonStr).id
      // this.$loading.show()
      getArticleDetail(this.id).then(res => {
        let data = res.data
        console.log(data)
        this.type = data.article.type
        if (this.type === 0) {
          this.swipeList = data.article.articleImg.map(e => e.url)
        } else if (this.type === 1) {
          data.article.articleImg.forEach(e => {
            if (e.cover) { // 封面
              this.playerOptions.poster = e.url
            } else { // 视频URL
              this.playerOptions.sources[0]['src'] = e.url
            }
          })
        }
        this.articleName = data.article.articleName
        this.authorAvatar = data.article.authorAvatar
        this.authorName = data.article.authorName
        this.createTime = data.article.createTime
        this.content = data.article.content
        this.likeNum = data.article.likeNum || 0
        this.shareNum = data.article.shareNum || 0
        this.isLike = data.isLike
        this.isFocus = data.isFocus
        this.skuList = data.skuList || []
        
      }).finally(() => {
        // this.$loading.hide()
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'HIDE_LOADING' }))
      })

      // 获取购物车数量
      if (!isEmpty(this.token)) {
        this.fetchCartCont()
      }

      // 获取分享文章可获得的积分
      getSysdictQuery('ARTICLE_CONFIG', 'SHARE_THE_INTEGRAL').then(res => {
        let json = JSON.parse(res.data)
        if (json.enable) {
          this.SHARE_THE_INTEGRAL = json.obtainIntegral || 0
        }
      })
      // 评论列表
      this.onLoad()

    },
    fetchCartCont() {
      getCartList().then(res => {
        this.cartCount = res.data.length
      })
    },
    // 返回上一页
    onBack() {
      window[javascriptChannelName].postMessage(JSON.stringify({ method: 'BACK' }))
    },
    // 关注/取消
    onFocus(type) {
      if (!this.token) {
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        return
      }
      this.loadingFocus = true
      focus(this.id, type).then(() => {
        this.isFocus = !this.isFocus
      }).finally(() => {
        this.loadingFocus = false
      })
    },
    // 添加购物车
    onAddCart(item) {
      if (!this.token) {
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        return
      }
      this.loadingCart = true
      addCart(1, item.id).then(() => {
        this.$toast('已加入购物车')
        this.fetchCartCont()
      }).finally(() => {
        this.loadingCart = false
      })
    },
    // 加载评论列表
    onLoad() {
      // console.log('onLoad')
      // let pageNo = this.pageNo <= 1 ? 1 : this.pageSize++
      this.loading = true
      getCommentList({ pageSize: this.pageSize, pageNo: this.pageNo, articleId: this.id }).then(res => {
        let data = res.data
        this.commentList = this.commentList.concat(data.list)
        this.isCommentListEmpty = isEmpty(this.commentList) && this.pageNo === 1
        this.totalComments = Number(data.total)
        if (!data.hasNextPage) {
          this.finished = true
        }
        this.error = false
        this.pageNo++
      }).catch(err => {
        this.error = true
        if (this.pageNo > 1) {
          this.pageNo--
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 收藏文章
    onLikeArticle() {
      if (!this.token) {
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        return
      }
      if (this.isLike) { // 取消
        this.isLike = false
        this.likeNum--
        cancelLikeArticle(this.id).catch(err => {
          this.isLike = true
          this.likeNum++
        })
      } else { // 收藏
        this.isLike = true
        this.likeNum++
        cancelLikeArticle(this.id).catch(err => {
          this.isLike = false
          this.likeNum--
        })
      }
    },
    toCart() {
      if (isEmpty(this.token)) {
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        return;
      }
      window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_CART', data: { flag: 'true' } }))
    },
    // 发表评论
    onPublish() {
      // console.log(this.value)
      if (isEmpty(this.value)) {
        this.$toast('评论内容不能为空')
        return
      }
      this.loadingPublish = true
      addComment({ articleId: this.id, content: this.value }).then(res => {
        // console.log(res)
        this.closePopup(0)
        this.value = ''
        this.totalComments++
        if (!isEmpty(res.data)) {
          this.commentList.unshift(res.data)
          this.isCommentListEmpty = false
          if (res.data.obtainIntegral > 0) {
            this.openPopup(2)
            this.integralTips.text = '评论文章'
            this.integralTips.value = res.data.obtainIntegral
          }
        }
      }).finally(() => {
        this.loadingPublish = false
      })
    },
    // 点赞评论
    onZan(item) {
      if (!this.token) {
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        return
      }
      if (item.isLike) {
        item.isLike = false
        cancelLikeComment(item.id).catch(err => {
          item.isLike = true
        })
      } else {
        item.isLike = true
        likeComment(item.id).catch(err => {
          item.isLike = false
        })
      }
    },
    // 分享文章
    async onWxShare() {
      try {
        this.$showLoading('正在打开微信')
        let res = await wxShare('article', this.id)
        let url = res.data.url // 分享URL
        let title = '这篇文章超好看~' // 分享标题
        let description = this.articleName // 分享描述
        let thumbnail = this.type === 0 ? this.swipeList[0] : this.playerOptions.poster // 封面图
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'WX_SHARE_ARTICLE', data: { url, title, description, thumbnail } }))
      } catch (error) {
        console.log(error)
      } finally {
        this.$hideLoading()
      }
    },
    // 微信分享回调
    wxShareArticleCallback(jsonStr) {
      // this.$hideLoading()
      if (JSON.parse(jsonStr).isSuccessful === 'true') {
        this.openPopup(1)
        shareArticle(this.id).then(res => {
          this.shareNum = res.data.shareNum
          if (res.data.obtainIntegral > 0) {
            this.openPopup(2)
            this.integralTips.text = '分享文章'
            this.integralTips.value = res.data.obtainIntegral
          }
        })
      }
    },
    // 跳转商详
    toGoodsDetail(item) {
      window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_GOODS_DETAIL', data: { spuId: item.spuId, skuId: item.id } }))
    },
    onScroll(e) {
      let { scrollTop } = e.target
      // console.log(scrollTop)
      if (scrollTop >= 70) {
        this.appBar = 1
      } else {
        this.appBar = 0
      }

      if (!this.stopRead) {
        if (this.$refs['scroll-box'].scrollTop > this.$refs['boundary'].offsetTop -  this.$refs['scroll-box'].clientHeight) {
          console.log('go')
          this.stopRead = true
          read(this.id).then(res => {
            if (res.data > 0) {
              this.openPopup(2)
              this.integralTips.text = '阅读文章'
              this.integralTips.value = res.data
            }
          })
        }
      }
    },
    onImagePreview: debounce(function(index) {
      // console.log(this.swipeList)
      window[javascriptChannelName].postMessage(JSON.stringify({ method: 'PREVIEW_IMAGE', data: { imgUrls: this.swipeList, index: index } }))
    }, 300),
    openPopup(type) {
      if (isEmpty(this.token)) {
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'TO_LOGIN' }))
        return
      }
      this.popup.show = true
      this.popup.type = type
      if (type === 0) {
        this.$nextTick(() => {
          this.$refs['field'].focus()
        })
      }
      if (type === 2) {
        setTimeout(() => {
          this.popup.show = false
        }, 1500);
      }
    },
    closePopup(type) {
      this.popup.show = false
      if (type === 0) {
        this.$refs['field'].blur()
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'CLOSE_KEYBOARD' }))
      }
    },
    getkeyboardHeight(jsonStr) {
      // console.log(JSON.parse(jsonStr).keyboardHeight)
      this.keyboardHeight = this.platformInfo.isIOS ? 0 : Number(JSON.parse(jsonStr).keyboardHeight)
    },
    onClickOverlay() {
      console.log('onClickOverlay')
      if (this.popup.type === 0) {
        this.$refs['field'].blur()
        window[javascriptChannelName].postMessage(JSON.stringify({ method: 'CLOSE_KEYBOARD' }))
      }
    }
  },
  beforeDestroy() {
    window.init = null
    window.wxShareArticleCallback = null
    window.getkeyboardHeight = null
  }
}
</script>

<style lang="scss" scoped>
.full-vw{
  width: 100vw;
  height: 100vw;
}
.app-bar{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding: 12px 0;
  padding-top: calc((var(--statusbar) + 16) * 1px) !important;
  background-color: transparent;
}
.video{
  width: 100%;
  height: 100%;
  /deep/ .video-js.vjs-fluid{
    height: 100% !important;
  }
  /deep/ .video-js .vjs-big-play-button{
    background: url('~@/assets/images/icon_play.png') no-repeat center;
    background-size: 100%;
    height: 45px;
    width: 45px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: none;
    .vjs-icon-placeholder{
      &::before{
        content: ''
      }
    }
  }
}
.goods-swipe{
  /deep/ .van-swipe__track{
    padding-bottom: 30px !important;
  }
}
.focus-btn{
  /deep/ .van-button__text{
    color: #121314;
  }
}

.integral-tips{
  background-color: #FFD100;
  font-weight: 600;
  text-align: center;
  width: 200px;
  border-radius: 30px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin: 0 auto 100px;
}
/deep/ .swiper-container{
  transform:translate3d(0,0,0);
  overflow:hidden;
  .swiper-slide{
    transform:translate3d(0,0,0);
  }
}

</style>