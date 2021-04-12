
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  projectName: '秒寻',
  // 本地store保存时添加该前缀
  projectKey: 'miaoxun_h5',
  headersTokenKey: 'authorization',
  isProd: process.env.NODE_ENV === 'production',
  // 与app设置的userAgent保持一致
  userAgent: 'FlutterApp',
  // 调用flutter通道名称，要与flutter设置的保持一致
  javascriptChannelName: 'flutter',
  // 设为true时，页面只在app端可访问，其他环境下打开会重定向到errorPage
  onlyApp: true,
  // errorPage
  errorPage: '/app-h5/error.html'
}