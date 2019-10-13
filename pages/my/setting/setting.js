var http = require('../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
    phone: wx.getStorageSync('user_phone'),
    registerDate: wx.getStorageSync('registerDate'),
    vacationStatus: 0
  },
  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    var _vacationStatus = e.detail.value ? 1 : 0
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      vacationStatus: _vacationStatus
    }
    http.post('/userInfo/updateUserInfoByParameter', params, function (res) {
      wx.setStorageSync('vacationStatus', res.data.vacationStatus)
    }, function (err) {

    }, function () {})
  },
  logout: function () {
    wx.showActionSheet({
      itemList: ['退出登录'],
      itemColor: '#E50505',
      success(res) {
        if (res.tapIndex === 0) {
          wx.showLoading()
          var params = {
            userId: wx.getStorageSync('user_id'),
            type: 2
          }
          http.post('/user/logout', params, function (res) {
            wx.removeStorageSync('token')
            wx.switchTab({
              url: '/pages/home/index/index'
            })
          }, function (err) {
            wx.showToast({
              title: err.msg,
              icon: 'none'
            })
          }, function () {
            wx.hideLoading()
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(this.data.vacationStatus)
    this.setData({ 'vacationStatus': wx.getStorageSync('vacationStatus')})
  }
})