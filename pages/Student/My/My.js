// pages/Student/My/My.js
const http = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    student: {}
  },


  openVita() {
    wx.navigateTo({
      url: '/pages/Student/Login/Login',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sid = wx.getStorageSync('user_id')
    sid && http.postPromise('/student/findStudent', { sid: wx.getStorageSync('user_id') }).then(data => {
      this.setData({ student: data.data[0] })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})