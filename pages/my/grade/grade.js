var http = require('../../../utils/api.js')
var util = require('../../../utils/util.js')
Page({
  data: {
    teacherPoints: 0,
    activeIdx: 0,
    teacherLevel: 'T0',
    totalPoints: '',
    scrollHeight: 0,
    bottomText: '',
    isMore: false,
    pageIndex: 1,
    pageSize: 10,
    tabs: [
      {
        name: "等级规则",
        code: 0
      },
      {
        name: "积分规则",
        code: 1
      },
      {
        name: "积分记录",
        code: 2
      }
    ],
    gradeList: [],
    integralList: [],
    integralLogList: []
  },
  switchTab: function (e) {
    let _idx = e.currentTarget.dataset.idx;
    if (this.data.activeIdx == _idx) {
      return;
    }
    this.setData({activeIdx: _idx})
    // 请求数据
    if (_idx == 0) {
      this.getGradeList()
    } else if (_idx == 1) {
      this.getIntegralList()
    } else {
      this.getIntegralLogList()
    }
    //console.log(e.currentTarget.dataset)
  },
  getGradeList: function () {
    var that = this;
    http.post('/levelRules/queryAllLevelRules', { teacherId: wx.getStorageSync('user_id')}, function (res) {
      //console.log(res)
      that.setData({ 'gradeList': res.data.levelRules.dataList, teacherLevel: res.data.teacherLevel, teacherPoints: res.data.teacherPoints })
    }, function (err) {

    }, function () { })
  },
  getIntegralList: function () {
    var that = this;
    http.get('/pointRules/queryAllPointsRules', function (res) {
      that.setData({ 'integralList': res.data.dataList })
    }, function (err) {

    }, function () { })
  },
  // 积分记录
  getIntegralLogList: function () {
    var that = this;
    var _integralLogList = that.data.integralLogList;
    var _pageIndex = that.data.pageIndex;
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      pageIndex: _pageIndex,
      pageSize: that.data.pageSize
    }
    that.setData({ 'bottomText': '' })
    http.post('/order/queryAllPointsLogByTeacherId', params, function (res) {
      var list = res.data.pointsLog.dataList;
      if (list.length < 10) {
        if (_integralLogList.length === 0 && list.length === 0) {
          // 暂无记录
          that.setData({
            'bottomText': '暂无记录',
            'isMore': false
          })
          that.isMore = false;
        } else {
          // 没有更多
          that.setData({
            'bottomText': '没有更多',
            'isMore': false
          })
        }
      } else {
        // 加载更多
        that.setData({
          'bottomText': '加载更多',
          'isMore': true
        })
      }
      if (list.length > 0) {
        list.forEach(function (item) {
          item.createTime = util.formatTime(item.createTime, '{y}-{m}-{d} {h}:{i}')
        })
      }
      _integralLogList = _integralLogList.concat(list)
      _pageIndex++
      that.setData({
        'integralLogList': _integralLogList,
        'totalPoints': res.data.totalPoints,
        'pageIndex': _pageIndex
      })
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () { })
  },
  lower: function (e) {
    //console.log(e)
    if (this.data.isMore) {
      this.getIntegralLogList()
    }
  },
  onLoad: function (options) {
    var query = wx.createSelectorQuery();
    query.select('#tBody').boundingClientRect();
    query.exec((res) => {
      this.setData({
        // 'teacherLevel': wx.getStorageSync('teacherLevel'),
        'scrollHeight': wx.getSystemInfoSync().windowHeight - (res[0].top + 40)
      })
    })
    this.getGradeList()
    this.getIntegralLogList()
  }
})