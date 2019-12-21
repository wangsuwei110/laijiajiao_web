// pages/Student/index/index.js

const http = require('../../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appriseList: [],
    subjectList: [],
    moreSubjectList: [],
    showTop: false,
    teacherList: [],
    total: 0,
    rate: '',
    RESOURCE_PERFIX: http.RESOURCE_PERFIX
  },


  onToTop() {
    this.selectComponent('#pageLayout').onToTop()
    this.setData({ showTop: false })
  },

  onShowTop(e) {
    this.setData({ showTop: e.detail })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const studentId = wx.getStorageSync('user_id')
    http.postPromise('/StudentDemand/homepageInfo').then(data => {
      const topList = ['语文', '数学', '英语', '奥数', '物理', '化学', '生物']
      const moreList = ['政治', '历史', '地理', '高数', '声乐', '古筝', '长笛', '美术', '日语', '德语', '法语', '韩语']
      this.setData({
        subjectList: topList.map(str => data.data.find(item => item.value === str)),
        moreSubjectList: moreList.map(str => data.data.find(item => item.value === str)),
      })
    })

    http.postPromise('/StudentDemand/queryGoodApprise').then(data => {
      this.setData({
        rate: data.data.data.rate,
        appriseList: data.data.data.goodApprise.slice(0, 2)
      })
    })

    http.postPromise('/userInfo/queryAllTeacherInfosByStudents', studentId ? { studentId } : {}).then(data => {
      this.setData({
        teacherList: data.data.dataList.slice(0, 2).map(item => {
          if (item.teachBrance) {
            item.teachBrance = JSON.parse(item.teachBrance)
            item.teachBranchSlave = item.teachBrance.map(item => item.teachBranchName).join(',')
          }
          return item
        }), total: data.data.total
      })
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