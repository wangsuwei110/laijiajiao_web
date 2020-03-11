// pages/curricul/index.js
var http = require('../../utils/api.js')
function timeWeek(index) {
  if (index === 1) return '周一'
  else if (index === 2) return '周二'
  else if (index === 3) return '周三'
  else if (index === 4) return '周四'
  else if (index === 5) return '周五'
  else if (index === 6) return '周六'
  else if (index === 7) return '周日'
}
const ONE_DAY = 864e5
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: null,
    endDate: null,
    details: null,
    time: new Date(),
    timeStr: '',
    curriculumList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('user_name') + '的排课表'
    })

/*     wx.requestSubscribeMessage({
      tmplIds: ['tIJJCwfwdGv-mNCU60HetaLFaADvwWX3So0yNeRBOVM']
    }) */
  },

  onOpenNoticeClick(){
    wx.requestSubscribeMessage({
      tmplIds: ['tIJJCwfwdGv-mNCU60HetaLFaADvwWX3So0yNeRBOVM']
    })
  },

  // 上一周
  prev() {
    this.setData({
      endDate: this.data.startDate,
      startDate: this.fun_date(-7, new Date(this.data.startDate))
    })
    let str = this.data.startDate.split('/')
    let orderTeachTime = str[0] + '-' + str[1] + '-' + str[2] + ' ' + '00:00:00'
    this.getList(orderTeachTime)
  },
  // 下一周
  next() {
    this.setData({
      startDate: this.data.endDate,
      endDate: this.fun_date(7, new Date(this.data.endDate))
    })
    let str = this.data.startDate.split('/')
    let orderTeachTime = str[0] + '-' + str[1] + '-' + str[2] + ' ' + '00:00:00'
    this.getList(orderTeachTime)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 查看教员课程表
  second(n) {
    if (n < 10) return '0' + n
    else return n
  },
  fun_date(index, date) {
    var date1 = date,
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + index);
    var time2 = date2.getFullYear() + "/" + this.second(date2.getMonth() + 1) + "/" + this.second(date2.getDate());
    return time2;
  },
  timeDate(date, index) {
    const current_date = date.getDate() - new Date().getDay() + 1;
    const current_month = this.second(date.getMonth() + 1);
    const current_year = this.second(date.getFullYear());
    const hours = this.second(date.getHours());
    const minutes = this.second(date.getMinutes());
    const seconds = this.second(date.getSeconds());
    let endDate = null
    if (index) return current_year + '/' + current_month + '/' + current_date
    return current_year + '/' + current_month + '/' + current_date + ' ' + hours + ':' + minutes + ':' + seconds
  },
  onNext() {
    const { time } = this.data
    this.fetchCurriculum(new Date(time.getTime() + ONE_DAY * 7))
  },

  onPrev() {
    const { time } = this.data
    this.fetchCurriculum(new Date(time.getTime() - ONE_DAY * 7))
  },
  generateDateStr(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}.${month < 10 ? 0 : ''}${month}.${day < 10 ? 0 : ''}${day}`
  },
  fetchCurriculum(orderTeachTime = this.data.time) {
    //console.log(this.data.time)
    var that = this
    http.post('/Timetable/queryTimeTableByTeacherId', { teacherId: wx.getStorageSync('user_id'), orderTeachTime }, function (res) {
      const wDay = orderTeachTime.getDay()
      const time = orderTeachTime.getTime()

      const prev = wDay === 0 ? 6 : (wDay - 1)
      const next = wDay === 0 ? 0 : (7 - wDay)

      const timeStr = `${that.generateDateStr(new Date(time - prev * ONE_DAY))}-${that.generateDateStr(new Date(time + next * ONE_DAY))}`

      const sumData = Array.from({ length: 7 });
      //res.data.unshift(res.data[0])
      

      
      res.data = res.data.map(item => {
        item.week = timeWeek(item.weekNum)
        const itemList = sumData[item.weekNum - 1] || { week: timeWeek(item.weekNum), list: Array.from({ length: 3 }).map(item => []) };
        itemList.list[item.timeNum].push(item)
        sumData[item.weekNum - 1] = itemList
        return item
      })
      
      //console.log(sumData)

      /* var ary1 = [], ary2 = [], ary3 = [], ary4 = [], ary5 = [], ary6 = [], ary7 = []
      for (var j = 0; j < res.data.length; j++) {
        if (res.data[j].weekNum === 1) {
          ary1.push(res.data[j])
        } else if (res.data[j].weekNum === 2) {
          ary2.push(res.data[j])
        } else if (res.data[j].weekNum === 3) {
          ary3.push(res.data[j])
        } else if (res.data[j].weekNum === 4) {
          ary4.push(res.data[j])
        } else if (res.data[j].weekNum === 5) {
          ary5.push(res.data[j])
        } else if (res.data[j].weekNum === 6) {
          ary6.push(res.data[j])
        } else if (res.data[j].weekNum === 7) {
          ary7.push(res.data[j])
        }
      }
      var sumData = [];
      sumData = [ary1, ary2, ary3, ary4, ary5, ary6, ary7] */
      that.setData({
        curriculumList: res.data,
        details: sumData,
        timeStr: timeStr,
        time: orderTeachTime
      })
    })
  },
  // getList (orderTeachTime) {
  //   var that = this
  //   http.post('/Timetable/queryTimeTableByTeacherId', {teacherId: wx.getStorageSync('user_id'), orderTeachTime: orderTeachTime}, function (res) {
  //     res.data = res.data.map(item => {
  //       let obj = item
  //       obj.week = timeWeek(JSON.parse(obj.weekNum))
  //       return obj
  //     })
  //     var ary1 = [], ary2 = [], ary3 = [], ary4 = [], ary5 = [], ary6 = [], ary7 = []
  //     for (var j = 0; j < res.data.length; j++) {
  //       if (res.data[j].weekNum === 1) {
  //         ary1.push(res.data[j])
  //       } else if (res.data[j].weekNum === 2) {
  //         ary2.push(res.data[j])
  //       }  else if (res.data[j].weekNum === 3) {
  //         ary3.push(res.data[j])
  //       }  else if (res.data[j].weekNum === 4) {
  //         ary4.push(res.data[j])
  //       }  else if (res.data[j].weekNum === 5) {
  //         ary5.push(res.data[j])
  //       }  else if (res.data[j].weekNum === 6) {
  //         ary6.push(res.data[j])
  //       }  else if (res.data[j].weekNum === 7) {
  //         ary7.push(res.data[j])
  //       } 
  //     }
  //     var sumData = [];
  //     sumData= [ary1, ary2, ary3, ary4, ary5, ary6, ary7]
  //     that.setData({
  //       details:sumData
  //     })
  //     //console.log(sumData)
  //   })

  // },
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
  timetableFun(e) {
    let str = this.data.startDate.split('/')
    let orderTeachTime = str[0] + '-' + str[1] + '-' + str[2] + ' ' + '00:00:00'
    var that = this
    wx.showModal({
      content: '请确定已到达授课地址附近，违规打卡将受惩处',
      success: function (res) {
        if (res.confirm) { //点击确定
          http.post('/Timetable/updateTimeTableByTeacherId', { teacherId: wx.getStorageSync('user_id'), classId: e.currentTarget.dataset.classid }, function (res) {
            that.fetchCurriculum(that.data.time)
            that.errFun('打卡成功')
          })
        } else { //点击否
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let orderTeachTime = this.timeDate(new Date(), 1).split('/')
    this.setData({
      startDate: this.timeDate(new Date(), 1),
      endDate: this.fun_date(7, new Date())
    })
    this.fetchCurriculum(new Date())
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