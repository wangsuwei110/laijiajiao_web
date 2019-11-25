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
  tabFun (e) {
    console.log(e)
    if (e.currentTarget.dataset.index === 0) {
      wx.reLaunch({
        url: '/pages/noHome/index',
      })
    }  else if (e.currentTarget.dataset.index === '5') {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    } else {
      wx.showModal({
        content: '需要先验证手机号，是否立即验证？',
        showCancel: true,//是否显示取消按钮
        cancelText:"否",//默认是“取消”
        confirmText:"是",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
           } else {
            wx.reLaunch({
              url: '/pages/login/login',
            })
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    }
    // wx.reLaunch({
    //   url: '/pages/login/login',
    // })
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