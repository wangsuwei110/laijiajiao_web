var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    achievement: []
  },
  getAchievementInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      pictureType: 5
    }
    wx.showLoading()
    http.post('/userInfo/queryUserPicturesByType', params, function (res) {
      var achievement = res.data
      that.setData({
        'achievement': achievement
      })
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },
  achievementDetail: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../achievementDetail/achievementDetail?id=' + id,
    })
  },
  addAchievement: function () {
    wx.navigateTo({
      url: '../achievementAdd/achievementAdd',
    })
  },
  onShow: function (options) {
    this.getAchievementInfo()
  }
})