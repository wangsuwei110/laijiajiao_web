var http = require('../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
    cashOut: null,
    openId: null
  },
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
    // var that = this
    // http.post('/user/getOpenId', {code: wx.getStorageSync('code')}, function (res) {
    //   var openId = res.data.openid
    //   that.setData({
    //     openId: openid
    //   })
    // })
  },
  getMoney(e) {
    this.setData({
      cashOut: e.detail.value
    })
  },
  saveBtn() {
    var that = this
    wx.login({
      success(res1) {
        if (res1.code) {

          http.postPromise('/user/getOpenId', { code: res1.code }).then(data => {
            //this.login(data.data.openid, gender)
            
            http.post('/wxRedPack/sendRedPack', { teacherId: wx.getStorageSync('user_id'), code: res1.code, cashOut: that.data.cashOut, openid: data.data.openid }, function (res) {
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

          }).catch(err => {
            err && wx.showToast({
              title: err.msg,
              icon: 'none'
            })
          })
          
          return false

          // http.post('/wxRedPack/sendRedPack', { teacherId: wx.getStorageSync('user_id'), code: res1.code, cashOut: that.data.cashOut }, function (res) {
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
          // wx.navigateTo({
          //   url: './cashSuccess/cashSuccess'
          // })
        }
      }
    })
    // 确认提现

  }
})