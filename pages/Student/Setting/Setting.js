// pages/Student/Setting/Setting.js
const http = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: {
      sid: 0,
      studentName: '',
      grade: 0,
      subjectId: 0,
      sex: 0,
      parentPhoneNum: '',
      createTime: '',
    },
  },


  onSignOut() {
    wx.showModal({
      title: '提示',
      content: '是否确定退出登录？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: result => {
        if (result.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('user_id')
          wx.removeStorageSync('user_name')
          wx.removeStorageSync('user_type')
          wx.reLaunch({
            url: '/pages/Student/Login/Login',
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    http.postPromise('/student/findStudent', { sid: wx.getStorageSync('user_id') }).then(data => {
      this.setData({ student: data.data })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})