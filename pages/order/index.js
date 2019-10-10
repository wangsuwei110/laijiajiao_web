Page({
  data: {
    scrollHeight: "",
    activeIdx: 0,
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
  onLoad: function () {
    const that = this;
    let winHeight = wx.getSystemInfoSync().windowHeight;
    let query = wx.createSelectorQuery();
    query.select("#tabsView").boundingClientRect(function (rect) {
      that.setData({
        scrollHeight: winHeight - rect.height
      })
    }).exec();
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
      url: './orderDetail/orderDetail?orderType=' + orderType,
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