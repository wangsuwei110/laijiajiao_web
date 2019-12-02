var http = require('../../../utils/api.js')
Page({
  data: {
    loaded: false,
    isEnd: false,
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
    ]
  },
  isEnd: false,
  pageIndex: 1,
  timeFormat (timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return newTimeStr;
  },
  onLoad: function (options) {
    const that = this;
    this.getList()
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
    this.getList()
  },
  getList (pageIndex = 1) {
    if (pageIndex === 1) {
      wx.showLoading({
        title: '加载中...'
      })
    }
    const { orderList, pageSize } = this.data
    this.isEnd || http.postPromise('//userAccountLog/queryUserAccountLogList', { 
      pageIndex, pageSize, teacherId: wx.getStorageSync('user_id'),
      paymentType: (this.data.activeIdx - 1) < 0 ? null : (this.data.activeIdx - 1)
    }).then(data => {
      //console.log(data, 'datadata')
      this.pageIndex = pageIndex
      this.isEnd = !data.data.dataList || data.data.dataList.length < pageSize
      data.data.dataList = data.data.dataList.map(item => {
        let obj = item
        if (obj.createTime) obj.createTime = this.timeFormat(obj.createTime)
        return obj
      })
      this.setData({ loaded: true, isEnd: !data.data.dataList || data.data.dataList.length < pageSize, revenueLists: pageIndex === 1 ? data.data.dataList : [...revenueLists, ...data.data.dataList] })
      wx.hideLoading()
    })
    
  },
  revenueDetail: function (e) {
    wx.navigateTo({
      url: '../revenueDetail/revenueDetail?paymentId=' + e.currentTarget.dataset.paymentid,
    })
  }
})