var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    ability: []
  },
  getAbilityInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      pictureType: 4
    }
    wx.showLoading()
    http.post('/userInfo/queryTeacherInfoByType', params, function (res) {
      var ability = res.data.pictures ? res.data.pictures : []
      console.log(ability)
      if (ability.length > 0) {
        ability.forEach(function (item) {
          var _pics = []
          item.pictureUrl.forEach(function (p) {
            p = that.data.RESOURCE_PERFIX + p
            _pics.push(p)
          })
          item.pictureUrl = _pics
        })
      }
      console.log(ability)
      that.setData({
        'ability': ability
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
  previewImg: function (e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.ability[e.currentTarget.dataset.id].pictureUrl,
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  openAddPage: function () {
    wx.navigateTo({
      url: '../abilityAdd/abilityAdd'
    })
  },
  onShow: function () {
    this.getAbilityInfo()
  }
})