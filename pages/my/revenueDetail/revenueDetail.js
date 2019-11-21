var http = require('../../../utils/api.js')
Page({
  data: {
    details: {}
  },
  timeFormat (timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return newTimeStr;
  },
  onLoad: function (options) {
    var that = this
    http.post('/userAccountLog/queryUserAccountLogDetail', {paymentId: options.paymentId}, function (res) {
      if (res.data.createTime) res.data.createTime = that.timeFormat(res.data.createTime)
      that.setData({
        details: res.data
      })
    })
  }
})