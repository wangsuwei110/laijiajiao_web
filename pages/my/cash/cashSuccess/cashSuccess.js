var http = require('../../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
  },
  onLoad: function (options) {
    http.post('/userAccountLog/queryUserAccountLogDetail', {mchBillno: options.id, formId: options.formId}, function (res) {
      console.log(res)
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