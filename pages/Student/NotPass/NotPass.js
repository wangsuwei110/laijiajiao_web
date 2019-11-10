// pages/Student/NotPass/NotPass.js
const http = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appraise: ''
  },

  onChange(event) {
    this.setData({
      appraise: event.detail.value
    })
  },

  onSubmit() {
    const { appraise } = this.data
    if (!appraise) {
      return wx.showToast({
        title: '请填写试讲不通过的原因',
        icon: 'none',
      });
    }

    wx.showLoading();

    http.getPromise('/StudentDemand/updateAdoptStatus', { demandId: this.demandId, appraise, status: 3 }).then(data => {
      const isSigle = data.msg === '感谢您的配合，是否开放本需求让更多教员来报名？'
      wx.showModal({
        title: '提示',
        content: data.msg,
        showCancel: data.data,
        cancelText: isSigle ? '取消' : '再等待',
        cancelColor: '#000000',
        confirmText: !data.data ? '我知道了' : isSigle ? '确定开放' : '继续预约',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm && data.data) {
            http.postPromise('/StudentDemand/openDemand', { demandId: this.demandId }).then(data => {
              wx.navigateBack({
                delta: 1
              });
            })
          } else {
            wx.navigateBack({
              delta: 1
            });
          }
        },
        fail: () => { },
        complete: () => { }
      });

      wx.hideLoading();
    }).catch(e => {
      wx.hideLoading();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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