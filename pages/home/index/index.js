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
  // 下拉刷新
 onPullDownRefresh () {
  // 显示顶部刷新图标
  wx.showNavigationBarLoading();
  this.getHome()
  // 隐藏导航栏加载框
  wx.hideNavigationBarLoading();
  // 停止下拉动作
  wx.stopPullDownRefresh();
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
  getHome () {
    var that = this
    http.post('/home/queryTeacherInfosByHome', {teacherId: wx.getStorageSync('user_id'),}, function (res) {
      console.log(res.data)
      var data = res.data

      if (data.newTrialStudentDemandList) {
        data.newTrialStudentDemandList = data.newTrialStudentDemandList.map(item => {
          let obj = item
          obj.createTime = timeFormat(obj.createTime)
          if (obj.orderTeachTime) {
            console.log(new Date(obj.orderTeachTime).getTime(), 'new Date(obj.orderTeachTime)new Date(obj.orderTeachTime)')
            obj.timeCha = that.timeFn(new Date(obj.orderTeachTime).getTime()) + that.timeStr(obj.orderTeachTime) + '试讲'
          }
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
      if (data.StudentLogVoList) {
        data.StudentLogVoList = data.StudentLogVoList.map(item => {
          let obj = item
          obj.createTime = timeFormat(obj.createTime)
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
