var http = require('../../../utils/api.js')
var gradesCheckedID = [], gradesCheckedValue = [], allgradesCheckedID = [], allgradesCheckedValue = [],
teachBranchSlaveId = [], teachBranchValue = []
let showValue = ''
Page({
  data: {
    isIPX: getApp().isIPX,
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
    currentIdx: -1,
    teachData: [],
    // teachLevel: [], // 授课学段
    // teachGrade: [], // 授课年级
    // teachBrance: [],  // 主授课目
    // teachBranchSlave: [], // 辅受科目
    teachAddress: [],  // 授课区域
    currentType: '',
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
    teachBranchValue: []
  },
  onLoad: function () {
    this.getGradesInfo()
    // this.getData()
  },
  onShow: function () {
    this.getGradesAndSubject()
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
  toggleTechType: function (e) {
    let _id = e.currentTarget.dataset.id
    if (this.data.currentIdx == _id) {
      _id = -1
    }
    this.setData({
      currentIdx: _id
    })
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
      isCurrentSubject: _id,
      'userinfo.teachBrance': _key
    })
    let teachBranchSlave = [], allsubjects = this.data.allsubjects
    // 生成辅授科目list
    for (var j = 0; j < allsubjects.length; j++) {
      if (allsubjects[j].key !== _key) {
        teachBranchSlave.push(allsubjects[j])
      }
    }
    this.setData({
      teachBranchSlave: teachBranchSlave
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
      ["subjects[" + _id + "].isHave"]: _isHave
    })
    this.getProject(this.data.teachLevel, _key)
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
    console.log(showVal, gradesCheckedValue)
    if (showVal.length >= 2) {
      showValue = showVal[0] + ',' +  showVal[1] + '...'
    } else {
      showValue = showVal.join(',')
    }
    this.setData({
      showValue: showValue,
      teachLevel: _key
    })
    this.getProject(_key)
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

  /**
   * 获取授课资料信息
   */
  getGradesInfo: function () {
    var that = this;
    // 1:教员等级 11:收费标准 31:授课学段 38:学员年级 54:日期 62:个人标签 78:授课区域 95:科目:小学
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      parentId: '62,78'
    }
    wx.showLoading({})
    var _teachData = []
    var _teachLevel = {}  // 授课学段
    var _teachClass = {}  // 学员年级
    var _teachBrance = {} // 主授科目
    var _teachBrance1 = {} // 辅授科目
    var _teachAddress = {}  // 授课区域
    var _weekTime = []  // 授课时间
    http.post('/parameter/queryParameters', params, function (res) {
      // var data = res.data[0]
      // _teachLevel.name = '授课学段'
      // _teachLevel.content = data.teachLevel
      // _teachLevel.type = '31'
      // _teachData.push(_teachLevel)
      // console.log(data.teachLevel.length)

      // if (data.teachLevel.length > 0) {
      //   var __teachLevel = []
      //   data.teachLevel.forEach(function (item) {
      //     item.name = item.teachLevelName
      //     item.parameterId = item.teachLevelId
      //     if (item.flag) {
      //       __teachLevel.push(item.parameterId)
      //     }
      //   })
      //   that.setData({
      //     'teachLevel': __teachLevel
      //   })
      // }

      // _teachClass.name = '授课年级'
      // _teachClass.content = data.teachGrade
      // _teachClass.type = '38'
      // _teachData.push(_teachClass)

      // if (data.teachGrade.length > 0) {
      //   var __teachGrade = []
      //   data.teachGrade.forEach(function (item) {
      //     item.name = item.teachGradeName
      //     item.parameterId = item.teachGradeId
      //     if (item.flag) {
      //       __teachGrade.push(item.parameterId)
      //     }
      //   })
      //   that.setData({
      //     'teachGrade': __teachGrade
      //   })
      // }

      // _teachBrance.name = '主授科目'
      // _teachBrance.type = '95-1'
      // _teachData.push(_teachBrance)
      // var _content = data.teachBranchMaster
      // if (_content.length > 0) {
      //   var __teachBrance = []
      //   _content.forEach(function (item) {
      //     item.name = item.teachBranchName
      //     item.parameterId = item.teachBranchId
      //     if (item.flag && item.branchType == 'master') {
      //       __teachBrance.push(item.parameterId)
      //     } else {
      //       item.flag = false
      //     }
      //   })
      //   _teachBrance.content = _content
      //   that.setData({
      //     'teachBrance': __teachBrance
      //   })
      // }

      // _teachBrance1.name = '辅授科目'
      // _teachBrance1.type = '95-2'
      // _teachData.push(_teachBrance1)
      // var _content1 = data.teachBranchSlave
      // if (_content1.length > 0) {
      //   var __teachBranceSlave = []
      //   _content1.forEach(function (item) {
      //     item.name = item.teachBranchName
      //     item.parameterId = item.teachBranchId
      //     if (item.flag && item.branchType == 'slave') {
      //       __teachBranceSlave.push(item.parameterId)
      //     } else {
      //       item.flag = false
      //     }
      //   })
      //   _teachBrance1.content = _content1
      //   that.setData({
      //     'teachBranchSlave': __teachBranceSlave
      //   })
      // }

      // _teachAddress.name = '授课区域'
      // _teachAddress.content = data.teachAddress
      // _teachAddress.type = '78'
      // _teachData.push(_teachAddress)
      // if (data.teachAddress && data.teachAddress.length > 0) {
      //   var __teachAddress = []
      //   data.teachAddress.forEach(function (item) {
      //     if (item.flag) {
      //       __teachAddress.push(item.parameterId)
      //     }
      //   })
      //   that.setData({
      //     'teachAddress': __teachAddress
      //   })
      // }
      // if (data.teachTime) {
      //   var __teachTime = JSON.parse(data.teachTime)
      //   if (__teachTime.length <= 0) {
      //     return
      //   }
      //   that.data.weekTime.forEach(function (item, index) {
      //     var _time = []
      //     item.forEach(function (_item) {
      //       _item.checked = false
      //       __teachTime.forEach(function (t) {
      //         if ((index + 1) == t.week) {
      //           t.time.split(',').forEach(function (__t) {
      //             if (__t == _item.value) {
      //               _item.checked = true
      //             }
      //           })
      //         }
      //       })
      //       _time.push(_item)
      //     })
      //     _weekTime.push(_time)
      //     that.setData({
      //       'weekTime': _weekTime
      //     })
      //   }) 
      // }
      // that.setData({
      //   'teachData': _teachData
      // })
      console.log(that.data.teachData)

    }, function (err) {
      console.log(err)
    }, function () {
      wx.hideLoading()
    })
  },
    /**
   * 保存授课资料 
   */
  saveTeaching: function () {
    // 授课时间
    var teachWeekTime = []
    if (this.data.weekTime.length > 0) {
      this.data.weekTime.forEach(function (item, index) {
        var _time = {}
        var _timeP = []
        item.forEach(function (_item) {
          if (_item.checked) {
            _timeP.push(_item.value)
          }
        })
        _time.week = (index + 1) + ''
        _time.time = _timeP.join(',')
        if (_timeP.length > 0) {
          teachWeekTime.push(_time)
        }
      })
    }
    var tipText = ''
    if (this.data.teachLevel.length <= 0) {
      tipText = '请选择授课学段'
    } else if (this.data.teachGrade.length <= 0) {
      tipText = '请选择授课年级'
    } else if (this.data.teachBrance.length <= 0) {
      tipText = '请选择主授科目'
    } else if (this.data.teachBranchSlave.length <= 0) {
      tipText = '请选择辅授科目'
    } else if (this.data.teachAddress.length <= 0) {
      tipText = '请选择授课区域'
    } else if (teachWeekTime.length <= 0) {
      tipText = '请选择授课时间'
    }
    if (tipText != '') {
      wx.showToast({
        title: tipText,
        icon: 'none'
      })
      return
    }
    wx.showLoading()
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      teachLevel: this.data.teachLevel.join(','),
      teachGrade: this.data.teachGrade.join(','),
      teachBrance: this.data.teachBrance.join(','),
      teachBranchSlave: this.data.teachBranchSlave.join(','),
      teachAddress: this.data.teachAddress.join(','),
      teachTime: JSON.parse(JSON.stringify(teachWeekTime))
    }
    // console.log(params)
    http.post('/userInfo/updateUserInfoByParameter', params, function (res) {
      wx.showToast({
        title: '保存成功',
        icon: 'none',
        success: function () {
          wx.navigateBack()
        }
      })
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
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
  /**
   * 获取授课资料信息
   */
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
  /**
   * 切换授课类型
   */
  // toggleTechType: function (e) {
  //   let _idx = e.currentTarget.dataset.idx;
  //   let _type = e.currentTarget.dataset.type;
  //   if (this.data.currentIdx == _idx) {
  //     _idx = -1;
  //   }
  //   this.setData({
  //     'currentIdx': _idx,
  //     'currentType': _type
  //   })
  // },
  /**
  /**
   * 选择授课时间
   */
  selectWeekDay: function (e) {
    var currentData = e.currentTarget.dataset
    var _checked = !currentData.checked
    var selectedWeek = []
    this.setData({
      ["weekTime[" + currentData.id + "][" + currentData.sid + "].checked"]: _checked
    })
  },
  /**
   * 保存授课资料 
   */
  saveTeaching: function () {
    // 授课时间
    var teachWeekTime = []
    if (this.data.weekTime.length > 0) {
      this.data.weekTime.forEach(function (item, index) {
        var _time = {}
        var _timeP = []
        item.forEach(function (_item) {
          if (_item.checked) {
            _timeP.push(_item.value)
          }
        })
        _time.week = (index + 1) + ''
        _time.time = _timeP.join(',')
        if (_timeP.length > 0) {
          teachWeekTime.push(_time)
        }
      })
    }
    var tipText = ''
    if (this.data.teachLevel.length <= 0) {
      tipText = '请选择授课学段'
    } else if (this.data.teachGrade.length <= 0) {
      tipText = '请选择授课年级'
    } else if (this.data.teachBrance.length <= 0) {
      tipText = '请选择主授科目'
    } else if (this.data.teachBranchSlave.length <= 0) {
      tipText = '请选择辅授科目'
    } else if (this.data.teachAddress.length <= 0) {
      tipText = '请选择授课区域'
    } else if (teachWeekTime.length <= 0) {
      tipText = '请选择授课时间'
    }
    if (tipText != '') {
      wx.showToast({
        title: tipText,
        icon: 'none'
      })
      return
    }
    wx.showLoading()
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      teachLevel: this.data.teachLevel.join(','),
      teachGrade: this.data.teachGrade.join(','),
      teachBrance: this.data.teachBrance.join(','),
      teachBranchSlave: this.data.teachBranchSlave.join(','),
      teachAddress: this.data.teachAddress.join(','),
      teachTime: JSON.parse(JSON.stringify(teachWeekTime))
    }
    // console.log(params)
    http.post('/userInfo/updateUserInfoByParameter', params, function (res) {
      wx.showToast({
        title: '保存成功',
        icon: 'none',
        success: function () {
          wx.navigateBack()
        }
      })
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
  }
})