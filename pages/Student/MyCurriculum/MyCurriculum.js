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
    dateList: [],

    dateStrList: ['一', '二', '三', '四', '五', '六', '日'],
    hoursList: [0, 1, 2],
    completeObj: {}
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

      const list = Array.from({ length: 7 })
      const completeObj = {}
      data.data.map(item => {
        //const dateObj = new Date(item.orderTeachTime)
        //const week = dateObj.getDay()
        //const hours = dateObj.getHours()
        const weekIndex = item.weekNum - 1
        const index = item.timeNum

        const weekList = list[weekIndex] || [[], [], []]
        const hoursList = weekList[index] || []
        hoursList.push(item)

        completeObj[`${weekIndex}_${index}`] = item.status

        weekList[index] = hoursList
        list[weekIndex] = weekList
      })

      console.log(list)

      //console.log(list)

      this.setData({ curriculum: data.data, loaded: true, time: orderTeachTime, timeStr, dateList: list, completeObj })
    })
  },

  onOpenNoticeClick(){
    wx.requestSubscribeMessage({
      tmplIds: ['tIJJCwfwdGv-mNCU60HetaLFaADvwWX3So0yNeRBOVM']
    })
  },
  
  onOverClick(e) {
    const { curriculum, student } = this.data
    const id = Number(e.currentTarget.dataset.id)

    const item = curriculum.find(item => item.sid === id)

    if (!item) {
      return wx.showToast({
        title: '课程不存在',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }

    const { sid, teacherId, demandId } = item

    /* wx.requestSubscribeMessage({
      tmplIds: ['UPhBQDD3ckPKFhoDLHuKwDwTRV0YTZkqyZo9ewszwQI']
    }) */

    wx.showModal({
      title: '提示',
      content: '请确定教员已完成本节课，结课成功后，平台将支付本次课时费，请谨慎操作。',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {

          http.postPromise('/StudentDemand/conclusion', { sid, teacherId, demandId }).then(data => {
            wx.showToast({
              title: '结课成功',
            });
            this.fetchCurriculum(student.sid)
          })
        }
      },
      fail: () => { },
      complete: () => { }
    });
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