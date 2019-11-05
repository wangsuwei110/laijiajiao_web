var http = require('../../../utils/api.js')
var gradesCheckedID = [], gradesCheckedValue = [], allgradesCheckedID = [], allgradesCheckedValue = [],
teachBranchSlaveId = [], teachBranchValue = [], addressCheckedID = [], addressCheckedValue = [], showAddress = '', showValue = ''
Page({
  data: {
    showAddress: '',
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
    importantSubId: null,
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
    teachBranchValue: [],

    // 选中字段
    checkLevelId: '',
    checkGradeId: '',
    checkSubjectId: '',
    checkSlaveId: '',
    checkedTime: ''
  },
  onLoad: function () {
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
    this.getGradesInfo()
    // this.getData()
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
    _isHave = _item.isHave === 1 ? 0 : 1
    if (_isHave) {
      teachBranchSlaveId.push(_key)
      teachBranchValue.push(_item.value)
    } else {
      console.log("uuuu")
      teachBranchSlaveId.splice(teachBranchSlaveId.indexOf(_key), 1)
      teachBranchValue.splice(teachBranchValue.indexOf(_item.value), 1)
    }
    this.setData({
      teachBranchValue: teachBranchValue
    })
    console.log(teachBranchValue, 'teachBranchValueteachBranchValueteachBranchValue')
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
    this.getProject(this.data.teachLevel, allgradesCheckedID.join(','))
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
            if (!teachGrade) {
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
                  if (that.data.importantSubId) {
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
                  }
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
              

              let teachBranchSlave = [], slave = ''
              // 生成辅授科目list
              for (var j = 0; j < _grades2.length; j++) {
                if (j !== that.data.isCurrentSubject) {
                  teachBranchSlave.push(_grades2[j])
                }
              }
            
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
  // 选择授课区域
  selectAddress (e) {
    let _item = e.currentTarget.dataset.item
    let _id = e.currentTarget.dataset.id
    let flag = null
    flag = _item.flag === true ? false : true
    this.setData({
      ["teachAddress[" + _id + "].flag"]: flag
    })
    let showVal = []
    if (flag === true) {
      addressCheckedID.push(_item.parameterId)
      addressCheckedValue.push(_item.name)
    } else {
      addressCheckedID.splice(addressCheckedID.indexOf(_item.parameterId), 1)
      addressCheckedValue.splice(addressCheckedValue.indexOf(_item.name), 1)
    }
    
    console.log(addressCheckedValue, 'gradesCheckedValuegradesCheckedValue')
    if (addressCheckedValue.length >= 2) {
      showAddress = addressCheckedValue[0] + ',' +  addressCheckedValue[1] + '...'
    } else {
      showAddress = addressCheckedValue.join(',')
    }
    this.setData({
      showAddress: showAddress
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
    var _teachAddress = {}  // 授课区域
    http.post('/parameter/queryParameters', params, function (res) {
      _teachAddress = res.data[0].teachAddress
      for (var i = 0; i < _teachAddress.length; i++) {
        if (_teachAddress[i].flag) {
          showAddress += _teachAddress[i].name + ','
          addressCheckedID.push(_teachAddress[i].parameterId)
        }
      }
      that.setData({
        teachAddress: _teachAddress,
        showAddress: showAddress,
        checkLevelId: res.data[0].teachLevel,
        checkGradeId: res.data[0].teachGrade,
        checkSubjectId: res.data[0].teachBranchMaster,
        checkSlaveId: res.data[0].teachBranchSlave,
        checkedTime: JSON.parse(res.data[0].teachTime)
      })
      for (let m = 0; m < _teachAddress.length; m++) {
        if (_teachAddress[m].flag) {
          addressCheckedID.push(_teachAddress[m].parameterId)
          addressCheckedValue.push(_teachAddress[m].name)
        }
      }
      for (var i = 0; i < that.data.checkedTime.length; i++) {
        console.log(that.data.checkedTime[i].week, '111')
        that.data.checkedTime[i].week = that.data.checkedTime[i].week - 1
        // that.setData({
        //   ["weekTime[" + that.data.checkedTime[i].week + "][" + that.data.checkedTime[i].time + "].checked"]: true
        // })
      }
      
      console.log(that.data.checkedTime)
      that.getGradesAndSubject()
    }, function (err) {
      console.log(err)
    }, function () {
    })
  },
    /**
   * 保存授课资料 
   */
  saveTeaching: function () {
    // 授课时间
//     var gradesCheckedID = [], gradesCheckedValue = [], allgradesCheckedID = [], allgradesCheckedValue = [], importantSubId
// teachBranchSlaveId = [], teachBranchValue = [], addressCheckedID = [], addressCheckedValue = [], showAddress = '', showValue = ''
    console.log(gradesCheckedID, allgradesCheckedID, this.data.importantSubId, teachBranchSlaveId)
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
        _time.time = _timeP
        if (_timeP.length > 0) {
          teachWeekTime.push(_time)
        }
      })
      var teachWeekTime1 = []
      for (var i = 0; i < teachWeekTime.length; i++) {
        for (var m = 0; m < teachWeekTime[i].time.length; m++) {
          teachWeekTime1.push({week: teachWeekTime[i].week, time: teachWeekTime[i].time[m]})
        }
      }
      console.log(teachWeekTime1, 'teachWeekTimeteachWeekTime')
    }
    var tipText = ''
    if (gradesCheckedID.length <= 0) {
      tipText = '请选择授课学段'
    } else if (allgradesCheckedID.length <= 0) {
      tipText = '请选择授课年级'
    } else if (!this.data.importantSubId || this.data.importantSubId === '') {
      tipText = '请选择主授科目'
    } else if (addressCheckedID.length <= 0) {
      tipText = '请选择授课区域'
    } else if (teachWeekTime1.length <= 0) {
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
      teachLevel: gradesCheckedID.join(','),
      teachGrade: allgradesCheckedID.join(','),
      teachBrance: this.data.importantSubId,
      teachBranchSlave: teachBranchSlaveId.join(','),
      teachAddress: addressCheckedID.join(','),
      teachTime: JSON.stringify(teachWeekTime1)
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
   * 获取辅导学段
   */
  getGradesAndSubject: function () {
    var that = this;
    // 1:教员等级 11:收费标准 31:授课学段 38:学员年级 54:日期 62:个人标签 78:授课区域 95:科目:小学
    var params = {
      parentId: '38,95',
      teacherId: wx.getStorageSync('user_id')
    }
    wx.showLoading({
      title: '加载中...'
    })
    console.log(this.data.checkLevelId, 'this.data.checkLevelIdthis.data.checkLevelId')
    var _grades = [], checkLevelId = this.data.checkLevelId.split(',')
    http.post('/teacher/listSubject', {}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
        if (data && data.length > 0) {
          data.forEach(function (item) {
            item.isHave = 0
            _grades.push(item)
          })
          for (let j = 0; j < _grades.length; j++) {
            for (let m = 0; m < checkLevelId.length; m++) {
              console.log(parseInt(checkLevelId[m]), _grades[j].key)
              if (_grades[j].key === parseInt(checkLevelId[m])) {
                _grades[j].isHave = 1
                gradesCheckedValue.push(_grades[j].value)
                gradesCheckedID.push(_grades[j].key)
              }
            }
          }
        }
        // 辅导学段的回显
        let showValue = ''
        if (gradesCheckedValue.length >= 2) {
          showValue = gradesCheckedValue[0] + ',' +  gradesCheckedValue[1] + '...'
        } else {
          showValue = gradesCheckedValue.join(',')
        }
        that.setData({
          'grades': _grades,
          teachLevel: gradesCheckedID.join(','),
          showValue: showValue
        })
        // 查询年级
        that.getProject(gradesCheckedID.join(','), null, function (res){
           // 查询科目
          that.getProject(that.data.teachLevel, allgradesCheckedID.join(','), function (res) {
            wx.hideLoading()
          })
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
    })
  },
  /**
  /**
   * 选择授课时间
   */
  selectWeekDay: function (e) {
    var currentData = e.currentTarget.dataset
    var _checked = !currentData.checked
    this.setData({
      ["weekTime[" + currentData.id + "][" + currentData.sid + "].checked"]: _checked
    })
  },

  hideTeachBox: function () {
    this.setData({
      currentIdx: -1
    })
  }
})