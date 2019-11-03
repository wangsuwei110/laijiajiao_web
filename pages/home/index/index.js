var http = require('../../../utils/api.js')
Page({
  data: {},
  onLoad: function () {
    this.getHome()
  },
  /**
   * 家教需求列表 
   */
  demandList: function () {
    wx.navigateTo({
      url: '../demandList/demandList',
    })
  },
  /**
   * 家教需求详情
   */
  demandDetail: function () {
    wx.navigateTo({
      url: '../demandDetail/demandDetail?id=41241',
    })
  },
  getHome () {
    http.post('/home/queryTeacherInfosByHome', {teacherId: wx.getStorageSync('user_id'),}, function (res) {
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
  },
  openGrade: function () {
    wx.navigateTo({
      url: '/pages/my/grade/grade',
    })
  },
  openHelp: function () {
    wx.showToast({
      title: '页面开发中，敬请期待',
      icon: 'none'
    })
  }
})
