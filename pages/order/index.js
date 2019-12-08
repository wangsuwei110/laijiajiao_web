
var http = require('../../utils/api.js')
Page({
  data: {
    scrollHeight: "",
    activeIdx: 0,
    // 列表
    list: [],
    form: {
    },
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
  timeStr (timeStr, index) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    if (index) return dataOne
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
    console.log(dayDiff, '111')
    var timeFn = dayDiff+"天后";
    if  (dayDiff < -1) return -(dayDiff)+'天前'
    else if (dateDiff === -1)return '当天' 
    else return  timeFn
  },
  second (n) {
    if (n < 10) return '0' + n
    else return n
  },
  // 订单列表
  getList () {
    var that = this
    wx.showLoading({
      title: '加载中...'
    })
    http.post('/teacher/queryDemandsByTeacher', this.data.form, function (res) {
      //console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        data = data.map(item => {
          let obj = item
          if (obj.createTime) obj.createTime = that.timeFormat(obj.createTime)
          if (obj.orderTeachTime) {
            let M = that.timeStr(obj.orderTeachTime, 1).split('-')
            //console.log(M)
            //console.log(M[0] + '/' + that.second(M[1]) + '/' + that.second(M[2]), 'new Date(obj.orderTeachTime)new Date(obj.orderTeachTime)')
            obj.timeCha = that.timeFn(new Date(M[0] + '/' + that.second(M[1]) + '/' + that.second(M[2])).getTime()) + that.timeStr(obj.orderTeachTime) + '试讲'
          }
          //console.log(obj.timeCha, '111')
          return obj
        })
        //console.log(data, 'datadata')
        that.setData({
          list: data
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, function (err) {
      //console.log(err)
    }, function () {
      wx.hideLoading()
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getList()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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
    this.setData({
      form: {
        teacherId: wx.getStorageSync('user_id'), 
        demandSignStatus: this.data.status,
        pageIndex: 1,
        pageSize: 10000
      }
    })
    this.getList()
  },
  switchTab: function (e) {
    let _idx = e.currentTarget.dataset.idx;
    if (this.data.activeIdx == _idx) {
      return;
    }
    this.setData({
      status: _idx === 1 ? '0,5' : _idx === 0 ? null : _idx === 3 ? '4' : _idx === 2 ? '1,2,3' : '',
      list: []
    })
    
    this.setData({
      activeIdx: _idx,
      form: {
        teacherId: wx.getStorageSync('user_id'), 
        demandSignStatus: this.data.status,
        pageIndex: 1,
        pageSize: 10000
      }
    })
    this.getList()
    // 请求数据
    //console.log(e.currentTarget.dataset)
  },
  revenueList: function () {

  },
  /**
   * 报名/支付订单详情
   */
  orderDetail: function (e) {
    //console.log(this.data.status)
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