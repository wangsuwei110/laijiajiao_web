var http = require('../../../utils/api.js')
// 时间格式化
function timeFormat (timeStr) {
  var dataOne = timeStr.split('T')[0];
  var dataTwo = timeStr.split('T')[1];
  var dataThree = dataTwo.split('+')[0];
  var newTimeStr = dataOne
  return newTimeStr;
}
// 
function timeWeek (index) {
  if (index === 1) return '周一'
  else if (index === 2) return '周二'
  else if (index === 3) return '周三'
  else if (index === 4) return '周四'
  else if (index === 5) return '周五'
  else if (index === 6) return '周六'
  else if (index === 7) return '周日'
}
function dayTimes (index) {
  if (index === 1) return '上午'
  else if (index === 2) return '下午'
  else if (index === 3) return '晚上'
}
Page({
  data: {
    details: ''
  },
  onLoad: function () {
    this.getHome()
  },
  /**
   * 家教需求列表 
   */
  demandList: function () {
    wx.navigateTo({
      url: '../demandList/demandList',
    })
  },

  /**
   * 家教需求详情
   */
  demandDetail: function () {
    wx.navigateTo({
      url: '../demandDetail/demandDetail?id=41241',
    })
  },
  getHome () {
    var that = this
    http.post('/home/queryTeacherInfosByHome', {teacherId: wx.getStorageSync('user_id'),}, function (res) {
      console.log(res.data)
      var data = res.data

      if (data.newTrialStudentDemandList) {
        data.newTrialStudentDemandList = data.newTrialStudentDemandList.map(item => {
          let obj = item
          obj.createTime = timeFormat(obj.createTime)
          return obj
        })
      }
      data.studentDemandList = data.studentDemandList.map((item, index) => {
        let obj = item
        obj.createTime = timeFormat(obj.createTime)
        if (obj.timeRange && (obj.timeRange.indexOf("'") !== -1 || obj.timeRange.indexOf('"') !== -1)) obj.timeRange = JSON.parse(obj.timeRange.replace(/'/g, '"'))
        console.log(obj.timeRange, 'obj.timeRange' + index , typeof obj.timeRange)
        if (typeof obj.timeRange !== 'string') { obj.timeRange = obj.timeRange.map((itemA, indexA) => {
            let objA = itemA
            if ((indexA + 1) === obj.timeRange.length) objA = timeWeek(objA.week) + dayTimes(objA.time)
            else objA = timeWeek(objA.week) + dayTimes(objA.time) + ','
            return objA
          })
        }
        return obj
      })
      if (data.fitTeacherOrderList) {
        data.fitTeacherOrderList = data.fitTeacherOrderList.map(item => {
          let obj = item
          obj.createTime = timeFormat(obj.createTime)
          if (obj.timeRange ) obj.timeRange = JSON.parse(obj.timeRange.replace(/'/g, '"'))
          console.log(obj.timeRange, 'obj.timeRange')
          obj.timeRange = obj.timeRange.map(itemA => {
            let objA = itemA
            objA = timeWeek(objA.week) + dayTimes(objA.time)
            return objA
          })
          return obj
        })
      }
      console.log(data, '11111')
      that.setData({
        details: data
      })
      if (res.code === '200') {
        console.log(data, '111111')
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
  openGrade: function () {
    wx.navigateTo({
      url: '/pages/my/grade/grade',
    })
  },
  openHelp: function () {
    wx.showToast({
      title: '页面开发中，敬请期待',
      icon: 'none'
    })
  }
})
