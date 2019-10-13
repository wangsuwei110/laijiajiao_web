var http = require('../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    userinfo: {}
  },
  openVita: function () {
    wx.navigateTo({
      url: './vita/vita',
    })
  },
  openVitaInfo: function () {
    wx.navigateTo({
      url: './vitaInfo/vitaInfo',
    })
  },
  openTeaching: function () {
    wx.navigateTo({
      url: './teaching/teaching',
    })
  },
  openRevenue: function () {
    wx.navigateTo({
      url: './revenue/revenue',
    })
  },
  openFeedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
    })
  },
  openSetting: function () {
    wx.navigateTo({
      url: './setting/setting',
    })
  },
  openHelp: function () {
    wx.showToast({
      title: '页面开发中，敬请期待',
      icon: 'none'
    })
  },
  getUserInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id')
    }
    http.post('/userInfo/queryTeacherInfo', params, function (res) {
      wx.showLoading()
      if (res.code === '200') {
        that.setData({
          userinfo: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, function (err) {
      wx.showToast({
        title: '请求出错',
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },
  previewImg: function (e) {
    wx.previewImage({
      current: e.target.dataset.url,
      urls: [e.target.dataset.url]
    })
  },
  onLoad: function () {
    this.getUserInfo()
  }
})