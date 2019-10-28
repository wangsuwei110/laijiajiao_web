// pages/Student/ReleaseDemand/ReleaseDemand.js
const http = require('../../../utils/api')
var appInst = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherInfo: null,
    grenderList: [
      {
        key: 1,
        name: '男'
      },
      {
        key: 2,
        name: '女'
      }
    ],
    studentList: [],
    subjectList: [],
    gradeList: [],
    student: {
      sid: 0
    }
  },


  onNameChange(e) {
    const { student } = this.data
    student.studentName = e.detail.value
    this.setData({ student })
  },

  onAddressChange(e) {
    const { student } = this.data
    console.log(student)
    student.demandAddress = e.detail.value
    this.setData({ student })
  },

  onDescChange(e) {
    const { student } = this.data
    student.demandDesc = e.detail.value
    this.setData({ student })
  },

  onGradeChange(e) {
    const { student } = this.data
    student.grade = e.detail.value
    this.setData({ student })
  },

  onSubjectChange(e) {
    const { student } = this.data
    student.subjectId = e.detail.value
    console.log(student, e)
    this.setData({ student })
  },

  onGrederChange(event) {
    const { student } = this.data
    student.sex = event.detail.value
    this.setData({ student })
  },




  //选择当前学员
  onStudentChange(e) {
    const { studentList } = this.data

    const student = studentList.find(item => item.sid === e.detail[10])
    if (student) {
      this.setData({
        student: Object.assign({}, student)
      })
    }
  },


  onGoSelectTime() {
    const { classNum = 0, timeRange = [] } = this.data.student
    appInst.globalData.weekData = { timeRange, classNum }

    wx.navigateTo({
      url: '/pages/Student/SelectClassTime/SelectClassTime',
    });
  },

  onSubmit() {
    const { student, teacherInfo } = this.data
    const demandType = teacherInfo ? 1 : 2 //demandType  :订单类型：1:单独预约，2:快速请家教
    const { demandAddress, demandDesc,
      grade: demandGrade,
      sid, sex,
      subjectId,
      studentName,
      timeRange, classNum } = student

    let res = ''

    if (!studentName) {
      res = '请输入学员名称'
    } else if (!demandAddress) {
      res = '请输入上课地址'
    } else if (!timeRange || !classNum) {
      res = '请选择预计上课时段'
    } else if (!demandDesc) {
      res = '请输入您的具体需求'
    }

    if (res) {
      wx.showToast({
        title: res,
        icon: 'none',
      });
    } else {
      wx.showLoading();

      http.postPromise('/StudentDemand/addStudentDemand', {
        studentId: sid,
        teacherId: teacherInfo && teacherInfo.teacherId,
        demandType,
        demandAddress,
        demandDesc,
        demandGrade,
        subjectId,
        sex,
        studentName,
        timeRange: JSON.stringify(timeRange),
        classNum,
        orderType: 1,
      }).then(data => {
        wx.showModal({
          title: '提示',
          content: data.msg,
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
        wx.hideLoading();
      }).catch(e => {
        wx.hideLoading();
      })
    }

    /* 
    classNum*	integer($int32)
每周上课次数

createTime*	string($date-time)
创建时间

createUser*	string
创建人

demandAddress*	string
上课地址

demandDesc*	string
具体需求

demandGrade*	integer($int32)
补习年级

offset	integer($int32)
orderMoney*	number($float)
订单金额

orderStart*	string($date-time)
付费订单开始时间

orderType*	integer($int32)
订单类型,1:试讲订单,2:付费订单

pageIndex	integer($int32)
页码，从1开始

pageSize	integer($int32)
每页记录数

sid	integer($int64)
status*	integer($int32)
状态 0:未发布，1:发布中;2:已接单;3:结单

studentId*	integer($int32)
学员ID

subjectId*	integer($int32)
辅导科目id

timeRange*	string
每周上课时间范围

updateTime*	string($date-time)
修改时间

updateUser*	string
修改人

weekNum*	integer($int32)
订单周数

} */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sid = wx.getStorageSync('user_id')

    if (options.teacherid) {
      http.postPromise('/userInfo/queryUserInfosDetail', {
        teacherId: options.teacherid,
        studentId: sid
      }).then(data => {
        this.setData({ teacherInfo: data.data.baseInfo })
      })
    }

    http.postPromise('/student/findStudent', { sid }).then(data => {
      //const student = data.data.find(item => item.sid === sid)
      this.setData({ student: data.data[0] })
    })

    http.postPromise('/subject/list').then(data => {
      this.setData({ subjectList: data.data.dataList })
    })

    http.postPromise('/grade/list').then(data => {
      this.setData({ gradeList: data.data })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { student } = this.data
    if (student.sid && appInst.globalData.weekData) {
      student.timeRange = appInst.globalData.weekData.timeRange
      student.classNum = appInst.globalData.weekData.classNum
      this.setData({ student })
    }
    appInst.globalData.weekData = null
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