Page({
  data: {
    scrollHeight: "",
    activeIdx: 0,
    tabs: [
      {
        name: "年级",
        code: 0
      },
      {
        name: "科目",
        code: 1
      },
      {
        name: "区域",
        code: 2
      },
      {
        name: "排序",
        code: 3
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
  onReady: function () {
    console.log('页面初次渲染完成')
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
    
  }
})