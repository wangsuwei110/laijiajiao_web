var http = require('../../../utils/api.js')
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
    week: ['一', '二', '三', '四', '五', '六', '日'],
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
    orderType: null,
    id: null,
    details: null,
    status: null
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      'orderType': parseInt(options.orderType),
      id: options.id
    })

    // orderType 
    // 为1， 2， 3为试讲(1需确定试讲时间，3试讲不通过，2教师已确认时间等待学生选老师)    
    // 为4 已支付     
    // 为0，5已报名（5教员的订单已被其他教员执行 该教员已支付   0教员的订单还未被选 该订单尚未执行）

    that.getOrderDetails()
  },
  timeFormat (timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return newTimeStr;
  },
  getOrderDetails () {
    var that = this
    http.post('/teacher/queryStudemtDemandDetail', {demandId: this.data.id, status: this.data.orderType}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        if (data.createTime) data.createTime = that.timeFormat(data.createTime)
        if (data.orderTeachTime) data.orderTeachTime = that.timeFormat(data.orderTeachTime)
        // 获取每周上课次数
        if (data.timeRange) {
          data.timeRange = JSON.parse(data.timeRange)
          data.timeRanges = data.timeRange.map(item => {
            let obj = item
            that.setData({
              ["weekTime[" + (item.week - 1) + "][" + item.time + "].checked"]: true
            })
            return timeWeek(obj.week) + dayTimes(obj.time)
          })
        }
        that.setData({
          details: data
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
  } 
})