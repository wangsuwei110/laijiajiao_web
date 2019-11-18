// pages/Student/MyCurriculum/MyCurriculum.js

const http = require('../../../utils/api')
const ONE_DAY = 864e5
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentList: [],
    student: {},
    loaded: false,
    curriculum: [],
    time: new Date(),
    timeStr: '',
  },

  onStudentChange(e) {
    this.setData({ student: e.detail.data })
  },


  onNext() {
    const { time, student } = this.data
    this.fetchCurriculum(student.sid, new Date(time.getTime() + ONE_DAY * 7))
  },
  
  onPrev() {
    const { time, student } = this.data
    this.fetchCurriculum(student.sid, new Date(time.getTime() - ONE_DAY * 7))
  },

  fetchCurriculum(studentId, orderTeachTime = this.data.time) {
    //console.log(this.data.time)
    http.postPromise('/StudentDemand/listMyCourse', { studentId, orderTeachTime }).then(data => {
      const wDay = orderTeachTime.getDay()
      const time = orderTeachTime.getTime()

      const prev = wDay === 0 ? 6 : (wDay - 1)
      const next = wDay === 0 ? 0 : (7 - wDay)

      const timeStr = `${this.generateDateStr(new Date(time - prev * ONE_DAY))}-${this.generateDateStr(new Date(time + next * ONE_DAY))}`
      
      this.setData({ curriculum: data.data, loaded: true, time: orderTeachTime, timeStr })
    })
  },

  onOverClick() {
    http.postPromise('/StudentDemand/conclusion').then(data => {

    })
  },


  generateDateStr(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}.${month < 10 ? 0 : ''}${month}.${day < 10 ? 0 : ''}${day}`
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.postPromise('/student/findStudent', { findType: 1, sid: wx.getStorageSync('user_id') }).then(data => {
      const student = data.data[0]
      this.setData({ studentList: data.data, loaded: true, student })

      this.fetchCurriculum(student.sid, new Date())
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