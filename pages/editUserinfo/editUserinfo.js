var http = require('../../utils/api.js')
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
    teachBranchSlave: []
  },
  getUserName: function (e) {
    this.setData({ 'userinfo.name': e.detail.value })
  },
  getUserSchool: function (e) {
    this.setData({ 'userinfo.school': e.detail.value })
  },
  getUserAddress: function (e) {
    this.setData({ 'userinfo.address': e.detail.value })
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
  selectTeach: function (e) {
    var that = this
    let _item = e.currentTarget.dataset.item
    let _parentId = e.currentTarget.dataset.parentid
    let _id = e.currentTarget.dataset.id
    let _isHave = null
    if (_parentId == 3 && this.data.teachBranchSlave.indexOf(_item.parameterId) != -1) {
      wx.showToast({
        title: '辅授科目已选择该课程',
        icon: 'none'
      })
      return
    }
    if (_parentId == '4' && this.data.teachBrance.indexOf(_item.parameterId) != -1) {
      wx.showToast({
        title: '主授科目已选择该课程',
        icon: 'none'
      })
      return
    }

    _isHave = _item.isHave == 1 ? 0 : 1
    if (_parentId == 2) {
      var _teachGrade = that.data.teachGrade
      if (_isHave) {
        _teachGrade.push(_item.parameterId)
      } else {
        _teachGrade.splice(_teachGrade.indexOf(_item.parameterId), 1)
      }
      that.setData({
        'teachGrade': _teachGrade
      })
      that.setData({
        ["grades[" + _id + "].isHave"]: _isHave
      })
    }
    if (_parentId == 3) {
      var _teachBrance = []
      var _subjectsId = ''
      if (_isHave) {
        _teachBrance.push(_item.parameterId)
      } else {
        _teachBrance.splice(_teachBrance.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachBrance': _teachBrance
      })
      // 完善信息的主授科目
      if (_item.parameterId != that.data.subjectsId) {
        _subjectsId = _item.parameterId
      }
      that.setData({
        subjectsId: _subjectsId
      })
    }
    if (_parentId == 4) {
      var _teachBranchSlave = this.data.teachBranchSlave
      if (_isHave) {
        _teachBranchSlave.push(_item.parameterId)
      } else {
        _teachBranchSlave.splice(_teachBranchSlave.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachBranchSlave': _teachBranchSlave
      })
      that.setData({
        ["subjects1[" + _id + "].isHave"]: _isHave
      })
    }
  },
  editUserinfo: function () {
    var data = this.data
    var tipText = ''
    if (data.userinfo.name.trim() == '') {
      tipText = '请输入教员姓名'
    } else if (data.userinfo.school.trim() == '') {
      tipText = '请输入大学名称'
    } else if (data.userinfo.address.trim() == '') {
      tipText = '请输入详细住址'
    } else if (data.teachGrade.length <= 0) {
      tipText = '请选择辅导年级'
    } else if (data.teachBrance.length <= 0) {
      tipText = '请选择主授科目'
    } else if (data.teachBranchSlave.length <= 0) {
      tipText = '请选择辅授科目'
    }
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
      school: data.userinfo.school,
      address: data.userinfo.address,
      teachGrade: data.teachGrade.join(','),
      teachBrance: data.teachBrance.join(','),
      teachBranchSlave: data.teachBranchSlave.join(',')
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
    http.post('/parameter/queryParameters', params, function (res) {
      console.log(res.data)
      var data = res.data[0]
      if (res.code === '200') {
        if (data.teachGrade && data.teachGrade.length > 0) {
          data.teachGrade.forEach(function (item) {
            item.isHave = 0
            _grades.push(item)
          })
        }
        if (data.teachBrance && data.teachBrance.length > 0) {
          data.teachBrance.forEach(function (item) {
            item.isHave = 0
            _subjects.push(item)
          })
        }
        if (data.teachBranceSlave && data.teachBranceSlave.length > 0) {
          data.teachBranceSlave.forEach(function (item) {
            item.isHave = 0
            _subjects1.push(item)
          })
        }
        that.setData({
          'grades': _grades,
          'subjects': _subjects,
          'subjects1': _subjects1
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