// pages/Student/MyCurriculum/MyCurriculum.js

const http = require('../../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentList: [],
    student: {},
    loaded: false,
    curriculum: [],
  },

  onStudentChange(e) {
    this.setData({ student: e.detail.data })
  },


  fetchCurriculum(studentId) {
    http.postPromise('/StudentDemand/listMyCourse', { studentId, orderTeachTime: new Date() }).then(data => {
      this.setData({ curriculum: data.data, loaded: true })
    })
  },

  onOverClick() {
    http.postPromise('/StudentDemand/conclusion').then(data => {

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.postPromise('/student/findStudent', { findType: 1, sid: wx.getStorageSync('user_id') }).then(data => {
      const student = data.data[0]
      this.setData({ studentList: data.data, loaded: true, student })

      this.fetchCurriculum(student.sid)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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