var http = require('../../utils/api.js')
var gradesCheckedID = [], gradesCheckedValue = []
Page({
  data: {
    userinfo: {
      name: '',
      school: '',
      address: '',
      phone: ''
    },
    currentIdx: -1,
    subjectsId: null,
    grades: [],
    subjects: [],
    subjects1: [],
    teachGrade: [],
    teachBrance: [],
    teachBranchSlave: [],
    // 根据大学名称输入框检索大学列表
    school: [],
    // 选中的辅导年纪
    currentTeach: null,
    teachLevel: null,
    // 主授科目
    allsubjects: []
  },
  getUserName: function (e) {
    this.setData({ 'userinfo.name': e.detail.value })
  },
  getUserSchool: function (e) {
    this.getSchool(e.detail.value)
    this.setData({
      currentIdx: 1
    })
  },
  getUserAddress: function (e) {
    this.setData({ 'userinfo.address': e.detail.value })
  },
  selectTeachBranch (e) {
    var that = this
    let _item = e.currentTarget.dataset.item
    let _id = e.currentTarget.dataset.id
    let _key = e.currentTarget.dataset.key
    let _isHave = null
    _isHave = _item.isHave == 1 ? 0 : 1
    this.setData({
      currentTeach: _id,
      // currentIdx: -1,
      'userinfo.teachBranchSlave': _item,
      ["allsubjects[" + _id + "].isHave"]: _isHave
    })
  },
  toggleTechType: function (e) {
    let _id = e.currentTarget.dataset.id
    if (this.data.currentIdx == _id) {
      _id = -1
    }
    this.setData({
      currentIdx: _id
    })
  },
  // 选择学校 
  selectSchool (e) {
    console.log(e, '1111111111')
    let key =  e.currentTarget.dataset.item
    this.setData({
      currentIdx: -1,
      'userinfo.school': key
    })
  },
  // 根据输入关键字选学校
  getSchool (text) {
    let school = []
    let that = this
    if (text === '') text = null
    http.post('/teacher/listUniversity', {schoolAndProvince: text}, function (res) {
      var data = res.data
      if (res.code === '200') {
        if (data && data.length > 0) {
          data.forEach(function (item) {
            item.isHave = 0
            school.push(item)
          })
        }
        that.setData({
          'school': school,
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
  },
  toggleLevel (e) {
    let _id = e.currentTarget.dataset.id
    if (this.data.currentIdx == _id) {
      _id = -1
    }
    this.setData({
      currentIdx: _id
    })
  },
  // 查询辅导学段
  getProject (grade, teachGrade) {
    let that = this
    http.post('/teacher/listSubject', {teachLevel: grade, teachGrade: teachGrade}, function (res) {
      var data = res.data
      let subjects = []
      if (res.code === '200') {
        if (data && data.length > 0) {
          data.forEach(function (item) {
            item.isHave = 0
            subjects.push(item)
            if (!teachGrade) {
              that.setData({
                'subjects': subjects,
              })
            } else {
              console.log(1111)
              that.setData({
                'allsubjects': subjects,
              })
              console.log(that.data.allsubjects)
            }
          })
        }
        
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
  },
  // 选择年级
  selectGrade (e) {
    var that = this
    let _item = e.currentTarget.dataset.item
    let _parentId = e.currentTarget.dataset.parentid
    let _id = e.currentTarget.dataset.id
    let _key = e.currentTarget.dataset.key
    let _isHave = null
    _isHave = _item.isHave == 1 ? 0 : 1
    this.setData({
      currentTeach: _id,
      // currentIdx: -1,
      'userinfo.grade': _item,
      ["subjects[" + _id + "].isHave"]: _isHave
    })
    
    this.getProject(this.data.teachLevel, _key)
  },
  selectTeach: function (e) {
    var that = this
    let _item = e.currentTarget.dataset.item
    let _parentId = e.currentTarget.dataset.parentid
    let _id = e.currentTarget.dataset.id
    let _key = e.currentTarget.dataset.key
    let _isHave = null
    _isHave = _item.isHave == 1 ? 0 : 1
    this.setData({
      currentTeach: _id,
      // currentIdx: -1,
      // teachLevel: _key,
      // 'userinfo.teachLevel': _item,
      ["grades[" + _id + "].isHave"]: _isHave
    })
    if (_isHave) {
      gradesCheckedID.push(_key)
      gradesCheckedValue.push(_item.value)
    } else {
      gradesCheckedID.splice(gradesCheckedID.indexOf(_key), 1)
      gradesCheckedValue.splice(gradesCheckedValue.indexOf(_item.value), 1)
    }
    this.getProject(_key)
  },
  editUserinfo: function () {
    var data = this.data
    var tipText = ''
    // if (data.userinfo.name.trim() == '') {
    //   tipText = '请输入教员姓名'
    // } else if (data.userinfo.school.trim() == '') {
    //   tipText = '请输入大学名称'
    // } else if (data.userinfo.address.trim() == '') {
    //   tipText = '请输入详细住址'
    // } else if (data.teachGrade.length <= 0) {
    //   tipText = '请选择辅导年级'
    // } else if (data.teachBrance.length <= 0) {
    //   tipText = '请选择主授科目'
    // } else if (data.teachBranchSlave.length <= 0) {
    //   tipText = '请选择辅授科目'
    // }
    if (tipText != '') {
      wx.showToast({
        title: tipText,
        icon: 'none'
      })
      return
    }
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      name: data.userinfo.name,
      id: 1989,
      address: data.userinfo.address,
      teachGrade: '1',
      teachBrance: '1',
      teachBranchSlave: '22',
      teachLevel: '1'
    }
    wx.showLoading()
    http.post('/userInfo/updateUserInfo', params, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      if (res.code === '200') {
        wx.setStorageSync('user_name', res.data.teacherName)
        wx.switchTab({
          url: '/pages/home/index/index',
        })
      }
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },
  hideTeachBox: function () {
    this.setData({
      currentIdx: -1
    })
  },
  getGradesAndSubject: function () {
    var that = this;
    // 1:教员等级 11:收费标准 31:授课学段 38:学员年级 54:日期 62:个人标签 78:授课区域 95:科目:小学
    var params = {
      parentId: '38,95',
      teacherId: wx.getStorageSync('user_id')
    }
    wx.showLoading({})
    var _grades = []
    var _subjects = []
    var _subjects1 = []
    http.post('/teacher/listSubject', {}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        if (data && data.length > 0) {
          data.forEach(function (item) {
            item.isHave = 0
            _grades.push(item)
          })
        }
        // if (data.teachBrance && data.teachBrance.length > 0) {
        //   data.teachBrance.forEach(function (item) {
        //     item.isHave = 0
        //     _subjects.push(item)
        //   })
        // }
        // if (data.teachBranceSlave && data.teachBranceSlave.length > 0) {
        //   data.teachBranceSlave.forEach(function (item) {
        //     item.isHave = 0
        //     _subjects1.push(item)
        //   })
        // }
        that.setData({
          'grades': _grades
          // 'subjects': _subjects,
          // 'subjects1': _subjects1
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
  },
  onLoad: function (options) {
    this.setData({
        'userinfo.phone': wx.getStorageSync('user_phone')
      })
    this.getGradesAndSubject()
  }
})