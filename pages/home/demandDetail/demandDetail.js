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
  if (index === 1) return '上午'
  else if (index === 2) return '下午'
  else if (index === 3) return '晚上'
}
Page({
  data: {
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
  onLoad: function (options) {
    console.log('家教需求详情ID=>' + options.id)
  },
  /**
   * 报名成为教员 
   */
  applyTutor: function () {
    
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
      res.data.studentDemandDetail.timeRange = JSON.parse(res.data.studentDemandDetail.timeRange)
      res.data.signUpTeacherInfo = res.data.signUpTeacherInfo.map(item => {
        let obj = item
        if (obj.createTime) obj.createTime = that.timeStr(obj.createTime, 1)
        return obj
      })
      res.data.studentDemandDetail.createTime = that.timeStr(res.data.studentDemandDetail.createTime, 1)
      res.data.studentDemandDetail.timeRanges = res.data.studentDemandDetail.timeRange.map(item => {
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
      id: options.id
    })
    this.getDetails()
  }
})