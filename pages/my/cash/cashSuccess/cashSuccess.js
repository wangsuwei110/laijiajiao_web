var http = require('../../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
    cashOut: null
  },
  onLoad: function (options) {
    this.setData({
      cashOut: options.cash
    })
  },
  navTo () {
    wx.navigateTo({
      url: '../../revenue/revenue',
    })
  },
  formSubmit (e) {
    wx.navigateTo({
      url: '../../revenue/revenue',
    })
  }
})