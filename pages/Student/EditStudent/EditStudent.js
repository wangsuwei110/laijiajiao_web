// pages/Student/EditStudent/EditStudent.js
const http = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: {
      sid: 0,
      studentName: '',
      grade: 0,
      subjectId: 0,
      sex: 1,
      parentPhoneNum: ''
    },

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

  onGradeChange(event) {
    const { student } = this.data
    student.grade = event.detail.value[0]
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
    } else if (!student.grade) {
      res = '请选择年级'
    } else if (!student.subjectId) {
      res = '请选择辅导科目'
    }

    if (res) {
      wx.showToast({
        title: res,
        icon: 'none',
      });
    } else {

      student.sex = ~~student.sex
      delete student.deleteStatus
      http.postPromise('/student/update', student).then(data => {
        wx.navigateBack({
          delta: 1
        });
      })
    }
  },


  onCloseClick() {
    const grade = this.selectComponent('grade')
    const subject = this.selectComponent('subject')
    grade && grade.onCancel()
    subject && subject.onCancel()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.id) {
      wx.setNavigationBarTitle({
        title: '修改学员',
      })

      http.postPromise('/student/findStudent', { sid: options.id }).then(data => {
        this.setData({ student: data.data })
      })
    }

    http.postPromise('/subject/list').then(data => {
      this.setData({ subjectList: data.data.dataList })
    })

    http.postPromise('/grade/list').then(data => {
      this.setData({ gradeList: data.data })
    })
  },
})