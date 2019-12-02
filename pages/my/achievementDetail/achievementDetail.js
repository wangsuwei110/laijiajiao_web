var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    achievementInfo: {}
  },
  /**
   * 预览图片
   */
  previewImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.achievementInfo.pictureUrl,
      success: function (res) {
        //console.log(res)
      },
      fail: function (err) {
        //console.log(err)
      }
    })
  },
  /**
   * 获取成功案例信息
   */
  getAchievementInfo: function (id) {
    var that = this
    var params = {
      pictureId: id
    }
    wx.showLoading()
    http.post('/userInfo/queryUserPicturesDetail', params, function (res) {
      var achievement = res.data
      var pics = achievement.pictureUrl.split(',')
      var _pics = []
      if (pics.length > 0) {
        pics.forEach(function (p) {
          p = that.data.RESOURCE_PERFIX + p
          _pics.push(p)
        })
      }
      achievement.pictureUrl = _pics
      
      that.setData({
        'achievementInfo': achievement
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
  onLoad: function (o) {
    //console.log(o)
    var id = o.id
    this.getAchievementInfo(id)
  }
})