Page({
  data: {
    isIPX: getApp().isIPX,
  },
  onLoad: function (options) {

  },
  navTo () {
    wx.navigateTo({
      url: '../../revenue/revenue',
    })
  },
})