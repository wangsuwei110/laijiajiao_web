// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onTeacherClick() {
    wx.reLaunch({
      url: '/pages/noHome/index',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },

  onStudentClick() {
    wx.reLaunch({
      url: '/pages/Student/index/index',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
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
    /* if (wx.getStorageSync('user_id')) {
      if (wx.getStorageSync('user_type') === 1) {
        wx.reLaunch({
          url: '/pages/Student/index/index',
        });
      } else {
        wx.switchTab({
          url: '/pages/home/index/index',
        })
      }
    } */
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