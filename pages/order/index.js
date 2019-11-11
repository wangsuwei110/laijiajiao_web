
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
  timeStr (timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return dataThree;
  },
  // 计算两个时间差 dateBegin 开始时间
  timeFn(dateEnd) {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateStart = new Date();//获取当前时间
    var dateDiff = dateEnd -  dateStart.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1=dateDiff%(24*3600*1000)  //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))//计算出小时数
    //计算相差分钟数
    var leave2=leave1%(3600*1000)  //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
    //计算相差秒数
    var leave3=leave2%(60*1000)   //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)
    var leave4=leave3%(60*1000)   //计算分钟数后剩余的毫秒数
    var minseconds=Math.round(leave4/1000)
    var timeFn = dayDiff+"天后";
    return timeFn;
  },
  // 订单列表
  getList () {
    var that = this
    http.post('/teacher/queryDemandsByTeacher', {teacherId: wx.getStorageSync('user_id'), demandSignStatus: this.data.status}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        data = data.map(item => {
          let obj = item
          if (obj.createTime) obj.createTime = that.timeFormat(obj.createTime)
          if (obj.orderTeachTime) {
            console.log(new Date(obj.orderTeachTime).getTime(), 'new Date(obj.orderTeachTime)new Date(obj.orderTeachTime)')
            obj.timeCha = that.timeFn(new Date(obj.orderTeachTime).getTime()) + that.timeStr(obj.orderTeachTime) + '试讲'
          }
          console.log(obj.timeCha, '111')
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
        scrollHeight: winHeight - rect.height,
        status: null
      })
    }).exec();
    this.getList()
  },
  switchTab: function (e) {
    let _idx = e.currentTarget.dataset.idx;
    //  
    this.setData({
      status: _idx === 1 ? '0,5' : _idx === 0 ? null : _idx === 3 ? '4' : _idx === 2 ? '1,2,3' : '',
      list: []
    })
    if (this.data.activeIdx == _idx) {
      return;
    }
    this.setData({
      activeIdx: _idx
    })
    this.getList()
    // 请求数据
    console.log(e.currentTarget.dataset)
  },
  revenueList: function () {

  },
  /**
   * 报名/支付订单详情
   */
  orderDetail: function (e) {
    console.log(this.data.status)
    var orderType = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: './orderDetail/orderDetail?orderType=' + orderType + '&id=' + e.currentTarget.dataset.id
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