// pages/Student/SelectClassTime/SelectClassTime.js
const http = require('../../../utils/api')
var appInst = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    classNum: 0,
    timeRange: [],

    teachTime: {},
    useTeach: false,

    frequencyList: [
      {
        id: 1,
        name: '1周1次',
      },
      {
        id: 2,
        name: '1周2次',
      },
      {
        id: 3,
        name: '1周3次',
      },
      {
        id: 4,
        name: '每天（4次及以上）',
      },
    ]
  },

  onWeekChange(e) {
    this.setData({ timeRange: e.detail })
  },


  onWeekNumChange(e) {
    this.setData({ classNum: Number(e.currentTarget.dataset.id) })
  },

  onSubmit() {
    let res = ''
    const { timeRange, classNum } = this.data
    if (!timeRange.length) {
      res = '请选择上课时间 '
    } else if (!classNum) {
      res = '请选择每周课数'
    }

    if (res) {
      wx.showToast({
        title: res,
        icon: 'none',
      });
    } else {
      appInst.globalData.weekData = { timeRange, classNum }
      wx.navigateBack({
        delta: 1
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.id) {
      http.postPromise('/userInfo/queryUserInfosDetail', {
        teacherId: options.id,
        //studentId: sid
      }).then(data => {
        const useTeach = !!data.data.baseInfo.teachTime
        const teachTime = (useTeach ? JSON.parse(data.data.baseInfo.teachTime) : []).reduce((obj, item) => {
          obj[item.week] = `${item.time}`.split(',').map(item => Number(item) + 1)
          return obj
        }, {})
        //console.log(teachTime)

        this.setData({ teachTime, useTeach })
      })
    }

    const weekData = appInst.globalData.weekData
    if (weekData) {
      this.setData({ classNum: weekData.classNum, timeRange: weekData.timeRange })
    }
    appInst.globalData.weekData = null
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