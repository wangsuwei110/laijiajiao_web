// pages/Student/Collect/Collect.js
const http = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: [],
    loaded: false,
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
  },

  fetchList() {
    http.postPromise('/teacher/connectList', { studentId: this.studentId }).then(data => {
      this.setData({
        loaded: true,
        collectList: data.data || []
      })
    })
  },

  onCancelCollect(e) {
    const teacherId = Number(e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '是否确定取消关注？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          http.postPromise('/teacher/cancelConnect', { studentId: this.studentId, teacherId }).then(data => {
            wx.showToast({
              title: '取消关注成功',
              icon: 'none',
            });

            this.fetchList()
          })
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.studentId = wx.getStorageSync('user_id')
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
    this.fetchList()
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