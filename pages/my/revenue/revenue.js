var http = require('../../../utils/api.js')
Page({
  data: {
    details: null
  },
  onLoad: function (options) {
    this.getAccount()
  },
  //查询用户收入
  getAccount () {
    var that = this
    http.post('/userAccount/queryUserAccount', {teacherId: wx.getStorageSync('user_id')}, function (res) {
      console.log(res.data)
      var data = res.data
      data.surplusMoney = data.surplusMoney.toFixed(2)
      if (res.code === '200') {
        console.log(data, '111111')
        that.setData({
          details: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, function (err) {
      console.log(err)
    }, function () {
      wx.hideLoading()
    })
  },
  // 我要提现
  cash () {
    wx.navigateTo({
      url: '../cash/cash?money=' + this.data.details.surplusMoney,
    })
  },
  revenueDetail: function () {
    wx.navigateTo({
      url: '../revenueList/revenueList',
    })
  }
})