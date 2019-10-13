Page({
  data: {
    activeIdx: 0,
    tabs: [
      {
        name: "等级规则",
        code: 0
      },
      {
        name: "积分规则",
        code: 1
      },
      {
        name: "积分记录",
        code: 2
      }
    ],
    gradeList: [
      {
        grade: '实习',
        integral: '-',
        continuationRate: '-',
        classFee: '100.00'
      },
      {
        grade: 'T1',
        integral: '100-300',
        continuationRate: '≥60%',
        classFee: '120.00'
      },
      {
        grade: 'T2',
        integral: '301-600',
        continuationRate: '≥70%',
        classFee: '160.00'
      },
      {
        grade: 'T3',
        integral: '601以上',
        continuationRate: '≥80%',
        classFee: '200.00'
      }
    ],
    integralList: [
      {
        integral: '+1/天',
        integralDesc: '打开系统',
        type: 1
      },
      {
        integral: '+10/天',
        integralDesc: '确定开讲时间',
        type: 1
      },
      {
        integral: '-50/次',
        integralDesc: '教员问题导致的退款',
        type: 0
      },
      {
        integral: '-20/次',
        integralDesc: '教员问题导致的退款',
        type: 0
      }
    ],
    integralLogList: [
      {
        integral: '+1/天',
        integralDesc: '打开系统',
        integralTime: '2019-09-12 12:23',
        type: 1
      },
      {
        integral: '+10/天',
        integralDesc: '确定开讲时间',
        integralTime: '2019-09-12 12:23',
        type: 1
      },
      {
        integral: '-50/次',
        integralDesc: '教员问题导致的退款',
        integralTime: '2019-09-12 12:23',
        type: 0
      }
    ]
  },
  switchTab: function (e) {
    let _idx = e.currentTarget.dataset.idx;
    if (this.data.activeIdx == _idx) {
      return;
    }
    this.setData({
      activeIdx: _idx
    })
    // 请求数据
    console.log(e.currentTarget.dataset)
  },
  onLoad: function (options) {

  }
})