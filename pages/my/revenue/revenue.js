var http = require('../../../utils/api.js')
Page({
  data: {

  },
  onLoad: function (options) {
    this.getAccount()
  },
  //查询用户收入
  getAccount () {
    // http.get('/userInfo/queryTeacherAccountByID?userId=' + wx.getStorageSync('user_id'), function (res) {
    //   console.log(res.data)
    //   var data = res.data
    //   if (res.code === '200') {
    //     console.log(data, '111111')
    //   } else {
    //     wx.showToast({
    //       title: res.msg,
    //       icon: 'none'
    //     })
    //   }
    // }, function (err) {
    //   console.log(err)
    // }, function () {
    //   wx.hideLoading()
    // })
  },
  // 我要提现
  cash () {
    wx.navigateTo({
      url: '../cash/cash',
    })
  },
  revenueDetail: function () {
    wx.navigateTo({
      url: '../revenueList/revenueList',
    })
  }
})