var http = require('../../../utils/api.js')
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
    teachLevel: [], // 授课学段
    teachGrade: [], // 授课年级
    teachBrance: [],  // 主授课目
    teachBranchSlave: [], // 辅受科目
    teachAddress: [],  // 授课区域
    currentType: ''
  },
  onShow: function () {
    this.getGradesAndSubject()
  },
  /**
   * 获取授课资料信息
   */
  getGradesAndSubject: function () {
    var that = this;
    // 1:教员等级 11:收费标准 31:授课学段 38:学员年级 54:日期 62:个人标签 78:授课区域 95:科目:小学
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      parentId: '31,38,78,95'
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
      console.log(res.data)
      var data = res.data[0]
      _teachLevel.name = '授课学段'
      _teachLevel.content = data.teachLevel
      _teachLevel.type = data.teachLevel[0].parentId + ''
      _teachData.push(_teachLevel)
      if (data.teachLevel.length > 0) {
        var __teachLevel = []
        data.teachLevel.forEach(function (item) {
          if (item.flag) {
            __teachLevel.push(item.parameterId)
          }
        })
        that.setData({
          'teachLevel': __teachLevel
        })
      }

      _teachClass.name = '授课年级'
      _teachClass.content = data.teachGrade
      _teachClass.type = data.teachGrade[0].parentId + ''
      _teachData.push(_teachClass)
      
      if (data.teachGrade.length > 0) {
        var __teachGrade = []
        data.teachGrade.forEach(function (item) {
          if (item.flag) {
            __teachGrade.push(item.parameterId)
          }
        })
        that.setData({
          'teachGrade': __teachGrade
        })
      }

      _teachBrance.name = '主授科目'
      _teachBrance.type = data.teachBrance[0].parentId + '-1'
      _teachData.push(_teachBrance)
      if (data.teachBrance.length > 0) {
        var _content = data.teachBrance
        var __teachBrance = []
        data.teachBrance.forEach(function (item) {
          if (item.flag && item.branchType == 'master') {
            __teachBrance.push(item.parameterId)
            item.flag = true
          } else {
            item.flag = false
          }
        })
        _teachBrance.content = _content
        that.setData({
          'teachBrance': __teachBrance
        })
      }

      _teachBrance1.name = '辅授科目'
      _teachBrance1.type = data.teachBrance[0].parentId + '-2'
      _teachData.push(_teachBrance1)
      if (data.teachBranceSlave.length > 0) {
        var _content = data.teachBranceSlave
        var __teachBranceSlave = []
        data.teachBranceSlave.forEach(function (item) {
          if (item.flag && item.branchType == 'slave') {
            __teachBranceSlave.push(item.parameterId)
            item.flag = true
          } else {
            item.flag = false
          }
        })
        _teachBrance1.content = _content
        that.setData({
          'teachBranchSlave': __teachBranceSlave
        })
      }

      _teachAddress.name = '授课区域'
      _teachAddress.content = data.teachAddress
      _teachAddress.type = data.teachAddress[0].parentId + ''
      _teachData.push(_teachAddress)

      if (data.teachAddress.length > 0) {
        var __teachAddress = []
        data.teachAddress.forEach(function (item) {
          if (item.flag) {
            __teachAddress.push(item.parameterId)
          }
        })
        that.setData({
          'teachAddress': __teachAddress
        })
      }
      if (data.teachTime) {
        var __teachTime = JSON.parse(data.teachTime)
        if (__teachTime.length <= 0) {
          return
        }
        that.data.weekTime.forEach(function (item, index) {
          var _time = []
          item.forEach(function (_item) {
            _item.checked = false
            __teachTime.forEach(function (t) {
              if ((index + 1) == t.week) {
                t.time.split(',').forEach(function (__t) {
                  if (__t == _item.value) {
                    _item.checked = true
                  }
                })
              }
            })
            _time.push(_item)
          })
          _weekTime.push(_time)
          that.setData({
            'weekTime': _weekTime
          })
        }) 
      }
      that.setData({
        'teachData': _teachData
      })

    }, function (err) {
      console.log(err)
    }, function () {
      wx.hideLoading()
    })
  },
  /**
   * 切换授课类型
   */
  toggleTechType: function (e) {
    let _idx = e.currentTarget.dataset.idx;
    let _type = e.currentTarget.dataset.type;
    if (this.data.currentIdx == _idx) {
      _idx = -1;
    }
    this.setData({
      'currentIdx': _idx,
      'currentType': _type
    })
  },
  /**
   * 选择授课信息
   */
  selectTeach: function (e) {
    let _item = e.currentTarget.dataset.item;
    console.log(_item)
    var _currentType = this.data.currentType
    let _parentId = e.currentTarget.dataset.parentid;
    let _id = e.currentTarget.dataset.id;
    let _flag = null;

    if (_currentType == '95-1' && this.data.teachBranchSlave.indexOf(_item.parameterId) != -1) {
      wx.showToast({
        title: '辅授科目已选择该课程',
        icon: 'none'
      })
      return
    }
    if (_currentType == '95-2' && this.data.teachBrance.indexOf(_item.parameterId) != -1) {
      wx.showToast({
        title: '主授科目已选择该课程',
        icon: 'none'
      })
      return
    }

    _flag = _item.flag ? false : true;
    if (_currentType == '95-1') {
      var _branch = []
      this.data.teachData.forEach(function (item) {
        console.log(item)
        if (item.type == '95-1' && item.content.length > 0) {
          item.content.forEach(function (_item, _index) {
            _item.flag = false
            if (_id == _index) {
              _item.flag = true
            }
            _branch.push(_item)
          })
        }
      })
      this.setData({
        ["teachData[" + _parentId + "].content"]: _branch
      })
    } {
      this.setData({
        ["teachData[" + _parentId + "].content[" + _id + "].flag"]: _flag
      })
    }
    if (_currentType == '31') { // 授课学段
      var _teachLevel = this.data.teachLevel
      if (_flag) {
        _teachLevel.push(_item.parameterId)
      } else {
        _teachLevel.splice(_teachLevel.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachLevel': _teachLevel
      })
    } else if (_currentType == '38') { // 授课年级
      var _teachGrade = this.data.teachGrade
      if (_flag) {
        _teachGrade.push(_item.parameterId)
      } else {
        _teachGrade.splice(_teachGrade.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachGrade': _teachGrade
      })
    } else if (_currentType == '95-1') { // 主授科目
      var _teachBrance = []

      if (_flag) {
        _teachBrance.push(_item.parameterId)
      } else {
        _teachBrance.splice(_teachBrance.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachBrance': _teachBrance
      })
    } else if (_currentType == '95-2') { // 辅授科目
      var _teachBranchSlave = this.data.teachBranchSlave
      if (_flag) {
        _teachBranchSlave.push(_item.parameterId)
      } else {
        _teachBranchSlave.splice(_teachBranchSlave.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachBranchSlave': _teachBranchSlave
      })
    } else if (_currentType == '78') { // 授课区域
      var _teachAddress = this.data.teachAddress
      if (_flag) {
        _teachAddress.push(_item.parameterId)
      } else {
        _teachAddress.splice(_teachAddress.indexOf(_item.parameterId), 1)
      }
      this.setData({
        'teachAddress': _teachAddress
      })
    }
  },
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