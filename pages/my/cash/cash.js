Page({
  data: {
    isIPX: getApp().isIPX
  },
  onLoad: function (options) {
  },
  saveBtn () {
    wx.navigateTo({
      url: './cashSuccess/cashSuccess'
    })
  }
})