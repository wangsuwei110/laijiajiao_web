var http = require('../../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
  },
  onLoad: function (options) {
    http.post('/userAccountLog/queryUserAccountLogDetail', {mchBillno: options.id}, function (res) {
      console.log(res)
    })
  },
  navTo () {
    wx.navigateTo({
      url: '../../revenue/revenue',
    })
  },
})