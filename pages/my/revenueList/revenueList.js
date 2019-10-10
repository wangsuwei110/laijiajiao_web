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
        name: "收入",
        code: 1
      },
      {
        name: "支出",
        code: 2
      }
    ],
    revenueLists: [
      {
        name: "提现",
        money: 150,
        type: 1,
        date: "2019-07-21 00:55:34"
      },
      {
        name: "收入",
        money: 5600,
        type: 2,
        date: "2019-07-20 00:55:34"
      },
      {
        name: "他人转帐",
        money: 2300,
        type: 2,
        date: "2019-07-20 00:55:34"
      }
    ]
  },
  onLoad: function (options) {
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
  revenueList: function (e) {
    console.log(e)
  },
  revenueDetail: function (e) {
    wx.navigateTo({
      url: '../revenueDetail/revenueDetail',
    })
  }
})