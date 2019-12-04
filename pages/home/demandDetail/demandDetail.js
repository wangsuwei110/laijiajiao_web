var http = require('../../../utils/api.js')
function timeWeek(index) {
  if (index === 1) return '周一'
  else if (index === 2) return '周二'
  else if (index === 3) return '周三'
  else if (index === 4) return '周四'
  else if (index === 5) return '周五'
  else if (index === 6) return '周六'
  else if (index === 7) return '周日'
}
function dayTimes(index) {
  if (index === 0) return '上午'
  else if (index === 1) return '下午'
  else if (index === 2) return '晚上'
}
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    type: null,
    showToast: null,
    errorText: null,
    isIPX: getApp().isIPX,
    id: null,
    details: null,
    week: ['一', '二', '三', '四', '五', '六', '日'],
    weekTime: [
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ]
    ],
    weekTimePeriod: [
      {
        name: '上午',
        period: '08:00 - 12:00'
      },
      {
        name: '下午',
        period: '12:00 - 18:00'
      },
      {
        name: '晚上',
        period: '18:00 - 23:00'
      }
    ],
  },
  message () {
    if (this.data.type === '1') {
      wx.showModal({
        content: '需要先验证手机号，是否立即验证？',
        showCancel: true,//是否显示取消按钮
        cancelText:"否",//默认是“取消”
        confirmText:"是",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
           } else {
            wx.reLaunch({
              url: '/pages/login/login',
            })
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
     return
    }
    wx.navigateTo({
      url: '/pages/my/feedback/feedback'
    })
  },
  // 显示错误提示
  errFun(text) {
    this.setData({
      showToast: true,
      errorText: text
    })
    var that = this
    setTimeout(function () {
      that.setData({
        showToast: false,
        errorText: text
      })
    }, 2000)
  },
  /**
   * 报名成为教员 
   */
  applyTutor: function () {
    if (this.data.details.singUpStatus) return
    if (this.data.type === '1') {
      wx.showModal({
        content: '需要先验证手机号，是否立即验证？',
        showCancel: true,//是否显示取消按钮
        cancelText:"否",//默认是“取消”
        confirmText:"是",//默认是“确定”
        success: function (res) {
           if (res.cancel) {
              //点击取消,默认隐藏弹框
           } else {
            wx.reLaunch({
              url: '/pages/login/login',
            })
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
     return
    }
    var that = this
    http.post('/teacher/validateSignParameters', { teacherId: wx.getStorageSync('user_id'), teachBranchId: this.data.details.studentDemandDetail.teachBranchId, teachGradeId:  this.data.details.studentDemandDetail.teachGradeId, parameterId:  this.data.details.studentDemandDetail.parameterId,timeList: this.data.details.studentDemandDetail.timeRange}, function (res1) {
        wx.showModal({
          content: res1.data.validateCode === false ? res1.data.validateResult : '是否确认报名?',
          success: function(res) {
            if (res.confirm) { //点击确定
              http.post('/teacher/signUpStudentDemand', { teacherId: wx.getStorageSync('user_id'), demandId: that.data.id }, function (res) {
                that.errFun('报名成功，请耐心等待报名结果')
                //console.log(res)
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/order/index'
                  })
                }, 2000);
              })
            } else { //点击否
            }
          }
        })
       
    })
    
  },
  timeStr(timeStr, index) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    if (index) return dataOne
    return dataThree;
  },
  timeFormat(timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return newTimeStr;
  },
  getDetails () {
    var that = this
    http.post('/home/queryStudentDemandSignUpTeacher', { teacherId: wx.getStorageSync('user_id'), demandId: this.data.id}, function (res) {
      if (res.data.studentDemandDetail.timeRange) {
        res.data.studentDemandDetail.timeRange = res.data.studentDemandDetail.timeRange.replace(/\'/g,'"') 
        res.data.studentDemandDetail.timeRange = JSON.parse(res.data.studentDemandDetail.timeRange)
      }
      if (res.data.signUpTeacherInfo ) {
        res.data.signUpTeacherInfo = res.data.signUpTeacherInfo.map(item => {
          let obj = item
          if (obj.createTime) obj.createTime = that.timeStr(obj.createTime, 1)
          return obj
        })
      }
      
      res.data.studentDemandDetail.createTime = that.timeStr(res.data.studentDemandDetail.createTime, 1)
      if (res.data.studentDemandDetail.timeRange) res.data.studentDemandDetail.timeRanges = res.data.studentDemandDetail.timeRange.map(item => {
        let obj = item
        if (obj.createTime) obj.createTime = that.timeFormat(obj.createTime)
        that.setData({
          ["weekTime[" + (obj.week - 1) + "][" + obj.time + "].checked"]: true,
          // weekDayTime: 
        })
        return timeWeek(obj.week) + dayTimes(obj.time)
      })
      that.setData({
        details: res.data
      })
    })
  },
  onLoad (options) {
    this.setData({
      id: options.id,
      type: options.type ? options.type : null
    })
    this.getDetails()
  }
})