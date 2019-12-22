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
    time: null,
    showToast: null,
    errorText: null,
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
    status: null,
    start: null,
    formData: {
    },
    index: 0,
    checkIndex: null,
    dates: null
  },

  onLoad: function (options) {
    var that = this;
    //console.log(options)
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

  second(n) {
    if (n < 10) return '0' + n
    else return n
  },

  bindDateChange(e) {
    //console.log(e.detail.value)
    this.setData({
      ["details.weekDayTime[" + this.data.checkIndex + "].index"]: e.detail.value,
      time: this.data.details.weekDayTime[this.data.checkIndex].array[e.detail.value]
    })
    //console.log(this.data.details)
  },

  checkboxFun(e) {
    this.setData({
      checkIndex: e.currentTarget.dataset.index,
      dates: e.currentTarget.dataset.date,
      formData: {
        demandId: this.data.id
      }
    })
    this.setData({
      time: this.data.details.weekDayTime[this.data.checkIndex].time === '0' ? '08:00' : this.data.details.weekDayTime[this.data.checkIndex].time === '1' ? '12:00' : '20:00'
    })
    //console.log(this.data.time, '111111111')
  },


  geneterMoneyList(moneyList) {
    return moneyList.sort((a, b) => a.paymentId - b.paymentId)
  },

  addAbility() {
    if (this.data.checkIndex === null) {
      this.errFun('请选择试讲时间')
      return
    }
    this.setData({
      'formData.orderTeachTime': this.data.dates + ' ' + this.data.time + ':00',
      'formData.teacherId': wx.getStorageSync('user_id')
    })
    var that = this
    http.post('/teacher/updateNewTrialDemand', this.data.formData, function (res) {
      that.errFun('试讲时间确定成功')
      setTimeout(function () {
        that.setData({
          orderType: 2
        })
        that.getOrderDetails()
      }, 2000)
    })
  },

  timeDate(date, index) {
    //console.log(date, 'datedatedatedate')
    const current_date = date.getDate();
    const current_month = this.second(date.getMonth() + 1);
    const current_year = this.second(date.getFullYear());
    if (index) return current_year + '-' + current_month + '-' + current_date
    // return current_year + '.' + current_month + '.' + current_date
    return current_month + '.' + current_date
  },

  timeFormat(timeStr) {
    var dataOne = timeStr.split('T')[0];
    var dataTwo = timeStr.split('T')[1];
    var dataThree = dataTwo.split('+')[0].split('.')[0];
    var newTimeStr = dataOne + ' ' + dataThree
    return newTimeStr;
  },

  arrayFun(index) {
    if (index === 0) {
      return ['08:00', '09:00', '10:00', '11:00']
    } else if (index === 1) {
      return ['12:00', '13:00', '14:00', '15:00']
    } else if (index === 2) {
      return ['20:00', '21:00', '22:00', '23:00']
    }
  },

  bindPickerChange(e) {
    //console.log(e)
  },

  getOrderDetails() {
    var that = this
    http.post('/teacher/queryStudemtDemandDetail', { demandId: this.data.id, status: this.data.orderType, teacherId: wx.getStorageSync('user_id') }, function (res) {
      //console.log(res.data)
      var data = res.data
      if (res.code === '200') {

        //按paymentId 排序
        const _moneyList = that.geneterMoneyList(JSON.parse(data.orderMoneyList) || [])
        console.log(_moneyList, JSON.parse(data.orderMoneyList))
        //找首次支付项
        const payItem = _moneyList.find(item => item.paymentType === 2)
        if (payItem) {
          data._orderMoney = payItem.paymentAccount
        }

        data._moneyList = _moneyList.filter(item => item.paymentType === 4)


        if (data.demandSignStatus === 3) {
          data.parentPhoneNum = Array.from(data.parentPhoneNum).map((key, index) => index > 2 && index < 7 ? '*' : key).join('')
        }


        if (data.createTime) data.createTime = that.timeFormat(data.createTime)
        if (data.createTime) data.signTime = that.timeFormat(data.signTime)
        if (data.orderTeachTime) data.orderTeachTime = that.timeFormat(data.orderTeachTime)
        if (data.orderStart) data.orderStart = that.timeFormat(data.orderStart)
        // 获取每周上课次数

        if (data.timeRange) {
          data.timeRange = JSON.parse(data.timeRange.replace(/\'/g, '"'))
          data.weekDayTime = data.timeRange.map(item => {
            let obj = item
            //console.log(timeWeek(obj.week), 'timeWeek(obj.week)timeWeek(obj.week)', obj.week)
            return {
              weekDayTimes: that.timeDate(new Date(obj.weekDayTime)),
              timeWeek: timeWeek(parseInt(obj.week)),
              dayTimes: dayTimes(parseInt(obj.time)),
              time: obj.time,
              array: that.arrayFun(parseInt(obj.time)),
              weekDay: that.timeDate(new Date(obj.weekDayTime), 1)
            }
          })
          data.timeRanges = data.timeRange.map(item => {
            let obj = item
            that.setData({
              ["weekTime[" + (item.week - 1) + "][" + item.time + "].checked"]: true,
              // weekDayTime: 
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
      //console.log(err)
    }, function () {
      wx.hideLoading()
    })
  },

  // 查看课表
  look() {
    wx.switchTab({
      url: '/pages/curricul/index'
    })
  },
})