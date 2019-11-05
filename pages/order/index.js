
var http = require('../../utils/api.js')
Page({
  data: {
    scrollHeight: "",
    activeIdx: 0,
    // 列表
    list: [],
    tabs: [
      {
        name: "全部",
        code: 0
      },
      {
        name: "报名",
        code: 1
      },
      {
        name: "试讲",
        code: 2
      },
      {
        name: "已支付",
        code: 3
      }
    ]
  },
  timeFormat (timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return newTimeStr;
  },
  // 订单列表
  getList () {
    var that = this
    http.post('/teacher/queryDemandsByTeacher', {teacherId: 6}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        data = data.map(item => {
          let obj = item
          obj.createTime = that.timeFormat(obj.createTime)
          return obj
        })
        console.log(data, 'datadata')
        that.setData({
          list: data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, function (err) {
      console.log(err)
    }, function () {
      wx.hideLoading()
    })
  },
  onLoad: function () {
    const that = this;
    let winHeight = wx.getSystemInfoSync().windowHeight;
    let query = wx.createSelectorQuery();
    query.select("#tabsView").boundingClientRect(function (rect) {
      that.setData({
        scrollHeight: winHeight - rect.height
      })
    }).exec();
    this.getList()
  },
  switchTab: function (e) {
    let _idx = e.currentTarget.dataset.idx;
    if (this.data.activeIdx == _idx) {
      return;
    }
    this.setData({
      activeIdx: _idx
    })
    // 请求数据
    console.log(e.currentTarget.dataset)
  },
  revenueList: function () {

  },
  /**
   * 报名/支付订单详情
   */
  orderDetail: function (e) {
    console.log(e)
    var orderType = e.currentTarget.dataset.orderType;
    
    wx.navigateTo({
      url: './orderDetail/orderDetail?orderType=' + orderType + '&id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 试讲订单详情
   */
  lectureOrderDetail: function () {
    wx.navigateTo({
      url: './lectureOrderDetail/lectureOrderDetail',
    })
  }
})