// pages/Student/StudentList/StudentList.js

const http = require('../../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentList: [],
    height: 0,
    loaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = this.createSelectorQuery()
    query.select('#bottomBtn').boundingClientRect(res => {
      //console.log(res.height, wx.getSystemInfoSync())
      this.setData({
        height: `${wx.getSystemInfoSync().windowHeight - res.height}px`
      })
    })
    query.exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    http.postPromise('/student/findStudent', { findType: 1, sid: wx.getStorageSync('user_id') }).then(data => {
      this.setData({ studentList: data.data, loaded: true })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})