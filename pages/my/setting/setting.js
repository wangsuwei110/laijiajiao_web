// pages/my/setting/setting.js
Page({
  data: {
    isIPX: getApp().isIPX,
  },
  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  onLoad: function (options) {

  }
})