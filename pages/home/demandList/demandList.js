var http = require('../../../utils/api.js')
// 时间格式化
function timeFormat (timeStr) {
  var dataOne = timeStr.split('T')[0];
  var dataTwo = timeStr.split('T')[1];
  var dataThree = dataTwo.split('+')[0];
  var newTimeStr = dataOne
  return newTimeStr;
}
// 
function timeWeek (index) {
  if (index === 1) return '周一'
  else if (index === 2) return '周二'
  else if (index === 3) return '周三'
  else if (index === 4) return '周四'
  else if (index === 5) return '周五'
  else if (index === 6) return '周六'
  else if (index === 7) return '周日'
}
function dayTimes (index) {
  if (index === 1) return '上午'
  else if (index === 2) return '下午'
  else if (index === 3) return '晚上'
}
Page({
  data: {
    type: null,
    show: false,
    teachGradeId: null,
    teachBranchId: null,
    parameterId: null,
    current: null,
    orderList: [],
    scrollHeight: "",
    activeIdx: null,
    isEnd: false,
    loaded: false,
    pageSize: 20,
    shai: [],
    tabs: [
      {
        name: "年级",
        code: 0
      },
      {
        name: "科目",
        code: 1
      },
      {
        name: "区域",
        code: 2
      }
    ]
  },
  pageIndex: 1,
  area: [],
  grade: [],
  subject: [],
  isEnd: false,
  onLoad: function (options) {
    const that = this;
    let winHeight = wx.getSystemInfoSync().windowHeight;
    let query = wx.createSelectorQuery();
    query.select("#tabsView").boundingClientRect(function (rect) {
      that.setData({
        scrollHeight: winHeight - rect.height,
        type: options.type
      })
    }).exec();
    this.getList()
    this.getArea()
    this.getGrad()
    this.getSubject()
  }, 
  shaiFun (e) {
    this.isEnd = false
    this.setData({
      show: false,
      isEnd: false,
      current: e.currentTarget.dataset.idxs,
    })
    //console.log(e.currentTarget.dataset.id)
    if (this.data.activeIdx === 0) {
      this.setData({
        teachGradeId: e.currentTarget.dataset.id,
        teachBranchId: null,
        parameterId: null
      })
    } else if (this.data.activeIdx === 1) {
      this.setData({
        teachBranchId: e.currentTarget.dataset.id,
        teachGradeId: null,
        parameterId: null
      })
    } else if (this.data.activeIdx === 2) {
      this.setData({
        parameterId: e.currentTarget.dataset.id,
        teachBranchId: null,
        teachGradeId: null
      })
    }
    this.getList()
  },
  /**
   * 家教需求详情
   */
  demandDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../demandDetail/demandDetail?id=' + id + '&type=' + this.data.type,
    })
  },
  // 所有教学区域
  getArea () {
    var that = this
    http.post('/parameter/queryParametersByType', {parentId: 78}, function (res) {
      //console.log(res)
      that.area = res.data
    })
  },
  // 所有教学年级
  getGrad () {
    var that = this
    http.post('/grade/queryAllGradelist', {}, function (res) {
      //console.log(res)
      that.grade = res.data
    })
  },
  // 所有教学科目
  getSubject () {
    var that = this
    http.post('/grade/queryAllBranchlist', {}, function (res) {
      //console.log(res)
      that.subject = res.data
    })
  },
  getList (pageIndex = 1) {
    if (pageIndex === 1) {
      wx.showLoading({
        title: '加载中...'
      })
    }
    const { orderList, pageSize } = this.data
    this.isEnd || http.postPromise('/home/queryAllStudentDemandList', { 
      pageIndex, pageSize, teacherId: wx.getStorageSync('user_id'),
      parameterId: this.data.parameterId,
      subjectId: this.data.teachBranchId,
      demandGrade: this.data.teachGradeId
    }).then(data => {
      //console.log(data, 'datadata')
      this.pageIndex = pageIndex
      this.isEnd = !data.data.studentDemandList || data.data.studentDemandList.dataList.length < pageSize
      data.data.studentDemandList.dataList = data.data.studentDemandList.dataList.map(item => {
        
        let obj = item
          if (obj.createTime) obj.createTime = timeFormat(obj.createTime)
          if (obj.timeRange && (obj.timeRange.indexOf("'") !== -1 || obj.timeRange.indexOf('"') !== -1)) obj.timeRange = JSON.parse(obj.timeRange.replace(/'/g, '"'))
          if (typeof obj.timeRange !== 'string') { obj.timeRange = obj.timeRange.map((itemA, indexA) => {
              let objA = itemA
              if ((indexA + 1) === obj.timeRange.length) objA = timeWeek(objA.week) + dayTimes(objA.time)
              else objA = timeWeek(objA.week) + dayTimes(objA.time) + ','
              return objA
            })
          }
          return obj
      })
      this.setData({ loaded: true, isEnd: !data.data.studentDemandList || data.data.studentDemandList.dataList.length < pageSize, orderList: pageIndex === 1 ? data.data.studentDemandList.dataList : [...orderList, ...data.data.studentDemandList.dataList] })
      wx.hideLoading()
    })
    
  },
  onReady: function () {
    //console.log('页面初次渲染完成')
  },
  onReachBottom: function () {
    this.getList(this.pageIndex + 1)
  },
  switchTab: function (e) {
    let _idx = e.currentTarget.dataset.idx;
   
    this.setData({
      show: _idx !== this.data.activeIdx ? true : this.data.show ? false : true
    })
    if (this.data.activeIdx == _idx) {
      return;
    }
    this.setData({
      activeIdx: _idx,
      current: null
    })
    // 请求数据
    if (_idx === 0) {
      this.setData({
        shai: this.grade
      })
    } else if (_idx === 1) {
      this.setData({
        shai: this.subject
      })
    } else if (_idx === 2) {
      this.setData({
        shai: this.area
      })
    } else if (_idx === 3) {
      this.setData({
        shai: ['发布时间', '上门距离']
        
      })
    }
    
  },
  revenueList: function () {
    
  }
})