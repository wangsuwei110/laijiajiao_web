// pages/noLogin/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: [{
      text: '首页',
      img: '../../images/index.png'
    }, {
      text: '课表',
      img: '../../images/curricul.png'
    }, {
      text: '订单',
      img: '../../images/order.png'
    }, {
      text: '我的',
      img: '../../images/my_active.png'
    }]
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
  tabFun () {
    wx.reLaunch({
      url: '/pages/login/login',
    })
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