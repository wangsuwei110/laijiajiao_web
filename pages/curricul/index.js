// pages/curricul/index.js
var http = require('../../utils/api.js')
function timeWeek (index) {
  if (index === 1) return '周一'
  else if (index === 2) return '周二'
  else if (index === 3) return '周三'
  else if (index === 4) return '周四'
  else if (index === 5) return '周五'
  else if (index === 6) return '周六'
  else if (index === 7) return '周日'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: null,
    endDate: null,
    details: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'WENPENG的排课表'
    })
  },
  // 上一周
  prev () {
    this.setData({
      endDate: this.data.startDate,
      startDate: this.fun_date(-7, new Date(this.data.startDate))
    })
    let str = this.data.startDate.split('.')
    let orderTeachTime = str[0] + '-' + str[1] + '-' + str[2] + ' ' + '00:00:00'
    this.getList(orderTeachTime)
  },
  // 下一周
  next () {
    this.setData({
      startDate: this.data.endDate,
      endDate: this.fun_date(7, new Date(this.data.endDate))
    })
    let str = this.data.startDate.split('.')
    let orderTeachTime = str[0] + '-' + str[1] + '-' + str[2] + ' ' + '00:00:00'
    this.getList(orderTeachTime)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 查看教员课程表
  second (n) {
    if (n < 10) return '0' + n
    else return n
  },
  fun_date(index, date){
    var date1 = date,
    time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+index);
    var time2 = date2.getFullYear()+"."+this.second(date2.getMonth()+1)+"."+this.second(date2.getDate());
    return time2;
  },
  timeDate (date, index) {
    const  current_date = date.getDate();
    const  current_month = this.second(date.getMonth() + 1);
    const  current_year = this.second(date.getFullYear());
    const  hours = this.second(date.getHours());
    const  minutes = this.second(date.getMinutes());
    const  seconds = this.second(date.getSeconds());
    let endDate = null
    if (index) return current_year + '.' + current_month + '.' + current_date
    return current_year + '-' + current_month + '-' + current_date + ' ' + hours + ':' + minutes + ':' + seconds
  },
  getList (orderTeachTime) {
    var that = this
    let str = {
      appraise: null,
      classNum: null,
      createTime: null,
      createUser: null,
      currentWeekDay: null,
      demandAddress: null,
      demandDesc: null,
      demandGrade: null,
      demandSignStatus: 4,
      demandSignUpNum: null,
      demandType: null,
      gradeSubject: null,
      orderEndDate: null,
      orderMoney: null,
      orderStart: "2019-10-23T07:46:10.000+0000",
      orderStartDate: null,
      orderTeachCount: null,
      orderTeachTime: null,
      orderType: null,
      parameterId: null,
      parentPhoneNum: null,
      sid: 20,
      signTime: null,
      status: 1,
      studentId: null,
      studentName: "caohuan",
      subjectId: null,
      subscribeStatus: null,
      teachBranchName: "初二英语",
      teachGradeName: null,
      teachName: "王素伟",
      timeRange: '{"week":"1","time":"3"}',
      updateTime: null,
      updateUser: null,
      weekNum: 2
    }
    http.post('/Timetable/queryTimeTableByTeacherId', {teacherId: 6, orderTeachTime: orderTeachTime}, function (res) {
      res.data.push(str)
      res.data = res.data.map(item => {
        let obj = item
        obj.timeRange = JSON.parse(obj.timeRange)
        obj.week = timeWeek(JSON.parse(obj.timeRange.week))
        return obj
      })
      var ary1 = [], ary2 = [], ary3 = [], ary4 = [], ary5 = [], ary6 = [], ary7 = []
      for (var j = 0; j < res.data.length; j++) {
        if (res.data[j].timeRange.week === '1') {
          ary1.push(res.data[j])
        } else if (res.data[j].timeRange.week === '2') {
          ary2.push(res.data[j])
        }  else if (res.data[j].timeRange.week === '3') {
          ary3.push(res.data[j])
        }  else if (res.data[j].timeRange.week === '4') {
          ary4.push(res.data[j])
        }  else if (res.data[j].timeRange.week === '5') {
          ary5.push(res.data[j])
        }  else if (res.data[j].timeRange.week === '6') {
          ary6.push(res.data[j])
        }  else if (res.data[j].timeRange.week === '7') {
          ary7.push(res.data[j])
        } 
      }

      var sumData = [];
      sumData= [ary1, ary2, ary3, ary4, ary5, ary6, ary7]
      that.setData({
        details:sumData
      })
      console.log(sumData)
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let orderTeachTime = this.timeDate(new Date())
    this.setData({
      startDate: this.timeDate(new Date(), 1),
      endDate: this.fun_date(7, new Date())
    })
    this.getList(orderTeachTime)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})