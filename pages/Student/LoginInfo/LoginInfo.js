// pages/Student/LoginInfo/LoginInfo.js

const util = require('../../../utils/util')
const http = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    student: {
      sid: 0,
      studentName: '',
      grade: 0,
      subjectId: 0,
      sex: 0,
      parentPhoneNum: ''
    },

    subjectList: [],
    gradeList: []
  },


  onGrederChange(event) {
    const { student } = this.data
    student.sex = event.detail.value
    this.setData({ student })
  },

  onNameChange(event) {
    const { student } = this.data
    student.studentName = event.detail.value
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

  onSubjectChange(event) {
    const { student } = this.data
    student.subjectId = event.detail.value[0]
    this.setData({ student })
  },

  onSubmit() {
    const { student } = this.data
    let res = ''
    if (!student.studentName) {
      res = '请输入学员姓名'
    } else if (!student.subjectId) {
      res = '请选择年级科目'
    }
    
    if (res) {
      wx.showToast({
        title: res,
        icon: 'none',
      });
    } else {
      student.sex = ~~student.sex

      const {
        sex,
        sid,
        studentName,
        subjectId,
        grade,
        teachLevel,
      } = student

      http.postPromise('/student/update', {
        sex,
        sid,
        studentName,
        subjectId,
        teachLevel,
        grade
      }).then(data => {
        wx.setStorageSync('user_name', studentName)
        wx.reLaunch({
          url: '/pages/Student/index/index',
        });
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.postPromise('/subject/list').then(data => {
      this.setData({ subjectList: data.data.dataList })
    })

    http.postPromise('/grade/list').then(data => {
      this.setData({ gradeList: data.data })
    })

    http.postPromise('/student/findStudent', { sid: wx.getStorageSync('user_id') }).then(data => {
      this.setData({ student: data.data[0] })
    })
  }
})