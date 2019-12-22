// pages/Student/ReleaseDemand/ReleaseDemand.js
const http = require('../../../utils/api')
var appInst = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherInfo: null,
    areaList: [],
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
    },
    teachAddress: [],
    teachBranchs: [],
  },


  onNameChange(e) {
    const { student } = this.data
    student.studentName = e.detail.value
    this.setData({ student })
  },

  onAreaChange(e) {
    const { student } = this.data
    student.parameterId = e.detail.value
    this.setData({ student })
  },

  onAddressChange(e) {
    const { student } = this.data
    //console.log(student)
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
    //console.log(e.detail)
    student.teachLevel = e.detail.value[0]
    student.grade = e.detail.value[1]
    student.subjectId = e.detail.value[2]

    this.setData({ student })
  },

  /*  onSubjectChange(e) {
     const { student } = this.data
     student.subjectId = e.detail.value
     //console.log(student, e)
     this.setData({ student })
   }, */

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
    const { teacherInfo, student } = this.data
    const { classNum = 0, timeRange = [] } = student
    const id = teacherInfo ? teacherInfo.teacherId : 0
    appInst.globalData.weekData = { timeRange, classNum }

    wx.navigateTo({
      url: `/pages/Student/SelectClassTime/SelectClassTime${id ? `?id=${id}` : ''}`,
    });
  },

  onSubmit() {
    const { student, teacherInfo, teachAddress, teachBranchs } = this.data
    const demandType = teacherInfo ? 1 : 2 //demandType  :订单类型：1:单独预约，2:快速请家教
    const {
      demandAddress, demandDesc,
      grade: demandGrade,
      sid, sex,
      subjectId,
      studentName,
      parameterId,
      timeRange, classNum
    } = student

    const _Func = function () {
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
        parameterId,
        studentName,
        timeRange: JSON.stringify(timeRange),
        classNum,
        orderType: 1,
      }).then(data => {
        wx.showModal({
          title: '提示',
          content: teacherInfo ? '预约成功，请等待教员确定试讲时间' : '已发布，请耐心等待报名结果',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.redirectTo({
                url: '/pages/Student/OrderList/OrderList'
              });
            }
          },
        });
        wx.hideLoading();
      }).catch(e => {
        wx.hideLoading();
      })

      wx.requestSubscribeMessage({
        tmplIds: [teacherInfo ? 'KB10ybjYSdInA9O9sobfhwr6yXxYMIpQ8cBIR0stX2o' : 'hWYWzWwSHDOwVP19CkH-g43SltRkR9QwxLYEom62VUI']
      })
    }

    let res = ''

    if (!studentName) {
      res = '请输入学员名称'
    } else if (!parameterId) {
      res = '请选择上课区域'
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
    } else if (teacherInfo) {

      //console.log(teachAddress, demandAddress)
      const gradeItem = teachBranchs.find(item => demandGrade === item.teachGradeId)
      const addressItem = teachAddress.find(item => parameterId === item.parameterId)

      if (!gradeItem || !addressItem) {
        wx.showModal({
          title: '提示',
          content: !addressItem ? '您的上课区域不在该教员的授课区域内，请谨慎选择' : '您的年级科目不在该教员的可授范围内，请谨慎选择',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {

              if (!addressItem && !gradeItem) {
                wx.showModal({
                  title: '提示',
                  content: '您的年级科目不在该教员的可授范围内，请谨慎选择',
                  showCancel: true,
                  cancelText: '取消',
                  cancelColor: '#000000',
                  confirmText: '确定',
                  confirmColor: '#3CC51F',
                  success: (result) => {
                    if (result.confirm) {
                      _Func()
                    }
                  },
                });
              } else {
                _Func()
              }
            }
          },
        });
      } else {
        _Func()
      }

    } else {
      _Func()
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

      wx.setNavigationBarTitle({
        title: '预约教员',
      });

      http.postPromise('/userInfo/queryUserInfosDetail', {
        teacherId: options.teacherid,
        //studentId: sid
      }).then(data => {
        this.setData({
          teacherInfo: data.data.baseInfo,
          teachAddress: data.data.teachAddress || [],
          teachBranchs: data.data.teachBranchs || [],
        })
      })
    }

    http.postPromise('/student/findStudent', { sid }).then(data => {
      //const student = data.data.find(item => item.sid === sid)
      this.setData({ student: data.data[0] })
    })

    http.postPromise('/subject/list').then(data => {
      this.setData({ subjectList: data.data.dataList })
    })

    /* http.postPromise('/grade/list').then(data => {
      this.setData({ gradeList: data.data })
    }) */

    http.postPromise('/parameter/queryParametersByType', { parentId: 78 }).then(data => {
      this.setData({ areaList: data.data })
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