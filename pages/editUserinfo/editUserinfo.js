var http = require('../../utils/api.js')
console.log(222)
var gradesCheckedID = [], gradesCheckedValue = [], allgradesCheckedID = [], allgradesCheckedValue = [],
teachBranchSlaveId = [], teachBranchValue = [], addressCheckedID = [], addressCheckedValue = [], showAddress = '', showValue = ''
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
    allsubjects: [],
    isCurrentSubject: null,
    // 辅授科目
    teachBranchSlave: [],
    // 用于学段页面回显
    showValue: null,
    // 用于选择年级回显
    showGradeValue: null,
    // 主授科目回显
    importantSub: null,
    // 辅助科目回显
    slave: null,
    gradesCheckedValue: [],
    allgradesCheckedValue: [],
    teachBranchValue: [],
    // 选中字段
    checkLevelId: '',
    checkGradeId: '',
    checkSubjectId: '',
    checkSlaveId: '',
    checkedTime: ''
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
  // 选择辅授科目
  selectTeachBranch (e) {
    var that = this
    let _item = e.currentTarget.dataset.item
    let _id = e.currentTarget.dataset.id
    let _key = e.currentTarget.dataset.key
    let _isHave = null
    let slave = null
    _isHave = _item.isHave == 1 ? 0 : 1

    if (_isHave) {
      teachBranchSlaveId.push(_key)
      teachBranchValue.push(_item.value)
    } else {
      console.log("uuuu")
      teachBranchSlaveId.splice(allgradesCheckedID.indexOf(_key), 1)
      teachBranchValue.splice(teachBranchValue.indexOf(_item.value), 1)
    }
    this.setData({
      teachBranchValue: teachBranchValue
    })
    if (teachBranchValue.length > 2) {
      slave = this.data.teachBranchValue[0] + ',' + this.data.teachBranchValue[1] + '...'
    } else {
      slave = this.data.teachBranchValue.join(',')
    }
    this.setData({
      slave: slave,
      ["teachBranchSlave[" + _id + "].isHave"]: _isHave
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
  getProject (grade, teachGrade, callBack, item) {
    let that = this
    var checkGradeId = this.data.checkGradeId.split(','),
    checkSubjectId = this.data.checkSubjectId, 
    checkSlaveId = this.data.checkSlaveId.split(',')
    http.post('/teacher/listSubject', {teachLevel: grade, teachGrade: teachGrade}, function (res) {
      var data = res.data
      if (res.code === '200') {
        if (data && data.length > 0) {
          console.log(data, 'datadatadata')
            if (!teachGrade && teachGrade !== '') {
              let _grades = data
              // 查询到辅导年级回显辅导年级
              for (let j = 0; j < _grades.length; j++) {
                for (let m = 0; m < checkGradeId.length; m++) {
                  if (_grades[j].key === parseInt(checkGradeId[m]) && allgradesCheckedID.indexOf(_grades[j].key) === -1) {
                    allgradesCheckedValue.push(_grades[j].value)
                    allgradesCheckedID.push(_grades[j].key)
                  }
                  if (allgradesCheckedID.indexOf(_grades[j].key) !== -1) {
                    _grades[j].isHave = 1
                  }
                }
              }
              let minGrades = _grades.map(item => {
                return item.key
              })

              let minvalue = _grades.map(item => {
                return item.value
              })
              // 检索当切换辅导学段时  辅导年级存在的某一年级无该辅导学段
              allgradesCheckedID = that.unique(that.getArrDifference(allgradesCheckedID, minGrades))
              allgradesCheckedValue = that.unique(that.getArrDifference(allgradesCheckedValue, minvalue))
              // that.selectGrade(allgradesCheckedID)
              if (item) {
                if (item.isHave) {
                  // if (that.data.importantSubId) {
                    that.setData({
                      importantSub: null,
                      importantSubId: null,
                      allsubjects: [],
                      isCurrentSubject: null,
                      teachBranchSlave: [],
                      slave: ''
                    })
                    teachBranchSlaveId = []
                    teachBranchValue = []
                    allgradesCheckedID = []
                    allgradesCheckedValue = []
                    console.log(that.data.subjects, 'that.data.subjectssss')
                    _grades = _grades.map(item => {
                      let obj = item
                      obj.isHave = 0
                      return obj
                    })
                  // }
                }
              }
              let showGradeValue = ''
              if (allgradesCheckedValue.length > 2) {
                showGradeValue = allgradesCheckedValue[0] + ',' + allgradesCheckedValue[1] + '...'
              } else {
                showGradeValue = allgradesCheckedValue.join(',')
              }
              that.setData({
                showGradeValue: showGradeValue,
                subjects: _grades
              })
            } else {
              that.setData({
                'allsubjects': data,
              })
              // 查询辅导科目并回显
              let _grades2 = data
              
              for (let j = 0; j < _grades2.length; j++) {
                if (_grades2[j].key === parseInt(checkSubjectId)) {
                  that.setData({
                    isCurrentSubject: j,
                    importantSub: _grades2[j].value,
                    importantSubId: _grades2[j].key
                  })
                }
              }
              let minGrades = _grades2.map(item => {
                return item.key
              })

              let minvalue = _grades2.map(item => {
                return item.value
              })
              // 检索当切换辅导年级时  辅导科目存在的某一科目无该辅导科目
              console.log(minGrades, that.data.importantSubId, '111111111111', minGrades.indexOf(that.data.importantSubId))
              console.log(item, 'itemitemitemitemitem')
              if (minGrades.indexOf(that.data.importantSubId) === -1 && item) {
                console.log('检索', item)
                if (item.isHave) {
                  that.setData({
                    isCurrentSubject: null,
                    importantSub: null,
                    teachBranchSlave: [],
                    slave: '',
                    importantSubId: null,
                    // allsubjects: [],
                    teachBranchSlave: [],
                  })
                  teachBranchSlaveId = []
                  teachBranchValue = []
                }
              }
              let teachBranchSlave = [], slave = ''
              // 生成辅授科目list
              for (let j = 0; j < _grades2.length; j++) {
                console.log(that.data.isCurrentSubject, j, 'that.data.isCurrentSubjectthat.data.isCurrentSubject')
                if (j !== that.data.isCurrentSubject && (that.data.isCurrentSubject || that.data.isCurrentSubject === 0)) {
                  teachBranchSlave.push(_grades2[j])
                }
              }
              console.log(teachBranchSlave, 'teachBranchSlaveteachBranchSlave')
              for (let j = 0; j < teachBranchSlave.length; j++) {
                for (let m = 0; m < checkSlaveId.length; m++) {
                  if (teachBranchSlave[j].key === parseInt(checkSlaveId[m])) {
                    teachBranchSlave[j].isHave = 1
                    teachBranchValue.push(teachBranchSlave[j].value)
                    teachBranchSlaveId.push(teachBranchSlave[j].key)
                  }
                }
              }
              if (teachBranchValue.length > 2) {
                slave = teachBranchValue[0] + ',' + teachBranchValue[1] + '...'
              } else {
                slave = teachBranchValue.join(',')
              }
              that.setData({
                slave: slave,
                teachBranchSlave: teachBranchSlave
              })
            }
            if (callBack) callBack(data)
          // })
        } else {
          if (!teachGrade && teachGrade !== '') {
            console.log(teachGrade)
            that.setData({
              importantSub: null,
              importantSubId: null,
              allsubjects: [],
              isCurrentSubject: null,
              teachBranchSlave: [],
              slave: '',
              subjects: [],
              showGradeValue: ''
            })
            teachBranchSlaveId = []
            teachBranchValue = []
            allgradesCheckedID = []
            allgradesCheckedValue = []
          } else {
            that.setData({
              isCurrentSubject: null,
              importantSub: null,
              teachBranchSlave: [],
              slave: '',
              importantSubId: null,
              // allsubjects: [],
              teachBranchSlave: [],
              allsubjects: []
            })
            teachBranchSlaveId = []
            teachBranchValue = []
          }
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
    })
  },
  // 选择主授科目 只能选一个
  selectSubject (e) {
    var that = this
    // 索引
    let _id = e.currentTarget.dataset.id
    // value
    let value = e.currentTarget.dataset.item.value
    // id
    let _key = e.currentTarget.dataset.key
    this.setData({
      importantSub: value,
      importantSubId: _key,
      isCurrentSubject: _id
    })
    let teachBranchSlave = [], allsubjects = this.data.allsubjects
    // 生成辅授科目list
    for (var j = 0; j < allsubjects.length; j++) {
      if (allsubjects[j].key !== _key) {
        teachBranchSlave.push(allsubjects[j])
      }
    }
    teachBranchSlaveId = []
    teachBranchValue = []
    this.setData({
      teachBranchSlave: teachBranchSlave,
      slave: ''
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
    let showGradeValue = ''
    if (_isHave) {
      allgradesCheckedID.push(_key)
      allgradesCheckedValue.push(_item.value)
    } else {
      allgradesCheckedID.splice(allgradesCheckedID.indexOf(_key), 1)
      allgradesCheckedValue.splice(allgradesCheckedValue.indexOf(_item.value), 1)
    }
    console.log(allgradesCheckedValue, 'allgradesCheckedValueallgradesCheckedValue')
    this.setData({
      allgradesCheckedValue: allgradesCheckedValue
    })
    if (this.data.allgradesCheckedValue.length > 2) {
      showGradeValue = this.data.allgradesCheckedValue[0] + ',' + this.data.allgradesCheckedValue[1] + '...'
    } else {
      showGradeValue = this.data.allgradesCheckedValue.join(',')
    }
    this.setData({
      showGradeValue: showGradeValue,
      ["subjects[" + _id + "].isHave"]: _isHave,
      slave: ''
    })
    this.getProject(this.data.teachLevel, allgradesCheckedID.join(','), function(){}, _item)
  },
  // 选择学段
  selectTeach: function (e) {
    var that = this
    let _item = e.currentTarget.dataset.item
    let _parentId = e.currentTarget.dataset.parentid
    let _id = e.currentTarget.dataset.id
    let _key = e.currentTarget.dataset.key
    let _isHave = null
    _isHave = _item.isHave === 1 ? 0 : 1
    this.setData({
      ["grades[" + _id + "].isHave"]: _isHave
    })
    let showVal = []
    if (_isHave === 1) {
      console.log('push')
      gradesCheckedID.push(_key)
      gradesCheckedValue.push(_item.value)
    } else {
      console.log('oooooo11')
      gradesCheckedID.splice(gradesCheckedID.indexOf(_key), 1)
      gradesCheckedValue.splice(gradesCheckedValue.indexOf(_item.value), 1)
    }
    console.log(gradesCheckedValue, 'gradesCheckedValuegradesCheckedValue')
    this.setData({
      gradesCheckedValue: gradesCheckedValue
    })
    showVal = this.data.gradesCheckedValue
    if (showVal.length >= 2) {
      showValue = showVal[0] + ',' +  showVal[1] + '...'
    } else {
      showValue = showVal.join(',')
    }
    this.setData({
      showValue: showValue,
      teachLevel: gradesCheckedID.join(',')
    })
    this.getProject(gradesCheckedID.join(','), null, function() {}, _item)
  },
  getArrDifference(arr1, arr2) {
    console.log(arr1, arr2, 'arr2arr2')
    return arr1.concat(arr2).filter(function(v, i, arr) {
      return arr.indexOf(v) !== arr.lastIndexOf(v);
    });
  },
  unique(arr) {
    return arr.filter(function(item, index, arr) {
      //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
      return arr.indexOf(item, 0) === index;
    });
  },
  editUserinfo: function () {
    var data = this.data
    var tipText = ''
    if (data.userinfo.name.trim() == '') {
      tipText = '请输入教员姓名'
    } else if (data.userinfo.school.trim() == '') {
      tipText = '请输入详细住址'
    } else if (data.userinfo.address.trim() == '') {
      tipText = '请输入详细住址'
    } else if (gradesCheckedID.length <= 0) {
      tipText = '请选择辅导学段'
    } else if (allgradesCheckedID.length <= 0) {
      tipText = '请选择辅导年级'
    } else if (!this.data.userinfo.teachBrance) {
      tipText = '请选择主授科目'
    }
    if (tipText != '') {
      wx.showToast({
        title: tipText,
        icon: 'none'
      })
      return
    }
    var teachLevel = gradesCheckedID.join(',')
    var teachGrade = allgradesCheckedID.join(',')
    var teachBranchSlave = teachBranchSlaveId.join(',')
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      name: data.userinfo.name,
      id: 1989,
      address: data.userinfo.address,
      // 选择年级
      teachGrade: teachGrade,
      // 主授科目
      teachBrance: this.data.userinfo.teachBrance,
      // 辅授科目
      teachBranchSlave: teachBranchSlave,
      // 选择学段
      teachLevel: teachLevel
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
    gradesCheckedID = []
    gradesCheckedValue = []
    allgradesCheckedID = []
    allgradesCheckedValue = []
    teachBranchSlaveId = []
    teachBranchValue = []
    addressCheckedID = []
    addressCheckedValue = []
    showAddress = ''
    showValue = ''
    this.setData({
        'userinfo.phone': wx.getStorageSync('user_phone')
      })
    this.getGradesAndSubject()
  }
})