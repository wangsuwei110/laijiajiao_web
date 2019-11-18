// pages/Student/OrderPass/OrderPass.js
const http = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
  },


  onCointinue() {
    wx.showLoading();
    http.postPromise('/StudentDemand/payDemand', { demandId: this.data.demandId }).then(data => {
      this.triggerEvent('onSubmit')
      wx.hideLoading();
    }).catch(e => {
      wx.hideLoading();
    })
  },

  onPay() {
    this.onCointinue()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ item: appInst.globalData.orderItem })
    appInst.globalData.orderItem = null


    this.demandId = options.id
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