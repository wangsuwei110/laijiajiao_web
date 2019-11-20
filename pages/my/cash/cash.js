var http = require('../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
    cashOut: null
  },
  onLoad: function (options) {
  },
  getMoney (e) {
    this.setData({
      cashOut: e.detail.value
    })
  },
  saveBtn () {
    // 确认提现
    http.post('/wxRedPack/sendRedPack', {teacherId: wx.getStorageSync('user_id'), code: wx.getStorageSync('code'), cashOut: this.data.cashOut}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        console.log(data, '111111')
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
    wx.navigateTo({
      url: './cashSuccess/cashSuccess'
    })
  }
})