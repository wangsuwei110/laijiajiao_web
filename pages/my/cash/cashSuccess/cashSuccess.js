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
    
    wx.requestSubscribeMessage({
      tmplIds: ['UPhBQDD3ckPKFhoDLHuKwDwTRV0YTZkqyZo9ewszwQI']
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