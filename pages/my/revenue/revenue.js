var http = require('../../../utils/api.js')
Page({
  data: {
    details: null
  },
  onShow: function () {
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
      if (that.data.details === null) {
        that.setData({
          details: {
            surplusMoney: 0.00,
            accountMoney: 0.00
          }
        })
      }
      wx.hideLoading()
    })
  },
  // 我要提现
  cash (e) {
    wx.navigateTo({
      url: '../cash/cash?money=' + this.data.details.surplusMoney + '&formId=' + e.detail.formId,
    })
  },
  revenueDetail: function () {
    wx.navigateTo({
      url: '../revenueList/revenueList',
    })
  }
})