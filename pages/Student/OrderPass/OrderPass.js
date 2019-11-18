// pages/Student/OrderPass/OrderPass.js
const http = require('../../../utils/api')
var appInst = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    timeRange: [],
    weekNum: 1,
  },

  onWeekChange(e) {
    this.setData({ timeRange: e.detail })
  },

  onWeekNumChange(e) {
    this.setData({ weekNum: e.detail })
  },

  onPay() {
    const { item, timeRange, weekNum } = this.data

    wx.login({
      success: (result) => {
        if (result.code) {
          wx.showLoading();
          http.postPromise('/weixin/prepay', { code: result.code, demandId: item.sid, timeRange: JSON.stringify(timeRange), weekNum }).then(data => {
            //this.triggerEvent('onSubmit')
            wx.requestPayment(data.data)

            wx.hideLoading();
          }).catch(e => {
            //console.log(e, 'error')
            wx.hideLoading();
          })
        } else {
          wx.showToast({
            title: result.errMsg,
          });
        }
      },
      fail: () => {

      },
    });
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