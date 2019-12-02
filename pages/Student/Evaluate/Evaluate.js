// pages/Student/Evaluate/Evaluate.js

const http = require('../../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate: 0,
    appraise: '',
    item: {},
  },

  onChange(event) {
    this.setData({
      appraise: event.detail.value
    })
  },

  onEvaluateChange(e) {
    const evaluate = Number(e.currentTarget.dataset.id)
    this.setData({ evaluate })
    //: evaluate === this.data.evaluate ? 0 : evaluate 
  },

  onSubmit() {
    const { evaluate, appraise } = this.data
    let res = ''

    if (!evaluate) {
      res = '请选择评价等级'
    } else if (!appraise) {
      res = '请输入评价内容'
    }

    if (res) {
      wx.showToast({
        title: res,
        icon: 'none',
      });
    } else {
      wx.showLoading();

      http.postPromise('/StudentDemand/appraise', { appraiseLevel: evaluate, appraise, demandId: this.demandId, teacherId: this.teacherId }).then(data => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '评论成功',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      }).catch(e => {
        wx.hideLoading();
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ item: appInst.globalData.orderItem })
    appInst.globalData.orderItem = null
    this.demandId = options.id
    this.teacherId = options.teacherid
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