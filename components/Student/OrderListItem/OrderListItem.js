// components/Student/OrderListItem/OrderListItem.js
const http = require('../../../utils/api')
const utils = require('../../../utils/util')
var appInst = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
      observer(item) {
        const createTimeStr = utils.formatTime(new Date(item.createTime).getTime())
        const appraiseTimeStr = utils.formatTime(new Date(item.appraiseTime).getTime())
        let orderTeachTimeStr = ''
        if (item.orderTeachTime) {
          //console.log(utils.formatTime(new Date(item.createTime).getTime()), 'ok',utils.formatTime(new Date(item.orderTeachTime).getTime()))
          orderTeachTimeStr = utils.formatTime(new Date(item.orderTeachTime).getTime())
        }

        this.setData({ createTimeStr, orderTeachTimeStr, appraiseTimeStr })
      }
    },
    payLogId: Number
  },


  /**
   * 组件的初始数据
   */
  data: {
    createTimeStr: '',
    orderTeachTimeStr: '',
    appraiseTimeStr: '',
    payLogList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCacheItem() {
      appInst.globalData.orderItem = this.data.item
    },


    onOverClick() {
      const { item } = this.data
      wx.showModal({
        title: '提示',
        content: '是否确定结束需求',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            wx.showLoading();
            http.postPromise('/StudentDemand/endDemand', { demandId: item.sid }).then(data => {
              wx.hideLoading();
              wx.showToast({
                title: '需求已结束',
              });
              this.triggerEvent('onSubmit')
            }).catch(e => wx.hideLoading())
          }
        },
      });
    },

    onPayLogClick() {
      const { item } = this.data
      http.postPromise('/StudentDemand/payLog', { paymentStreamId: item.paymentStreamId }).then(data => {
        this.setData({
          payLogList: data.data.map(item => {
            item.createTimeStr = utils.formatTime(new Date(item.createTime).getTime())
            return item
          })
        })
      })
      this.triggerEvent('onPayLogClick', this.data.item.sid)
    },

    onSeeTeachClick() {
      const { item } = this.data
      this.setCacheItem()
      wx.navigateTo({
        url: `/pages/Student/ViewAppointment/ViewAppointment?id=${item.sid}`,
      });
    },

    onNoPassClick() {
      const { item } = this.data
      this.setCacheItem()
      wx.navigateTo({
        url: `/pages/Student/NotPass/NotPass?id=${item.sid}`,
      });
    },

    onGoEvaluate() {
      const { item } = this.data
      this.setCacheItem()
      wx.navigateTo({
        url: `/pages/Student/Evaluate/Evaluate?id=${item.sid}&teacherid=${item.teacherId}`,
      });
    },

    onGoPay() {
      const { item } = this.data
      this.setCacheItem()

      wx.navigateTo({
        url: `/pages/Student/OrderPass/OrderPass?id=${item.sid}`,
      });
    },

    onPassClick() {
      //this.onGoPay()
      const { item } = this.data
      wx.showModal({
        title: '提示',
        content: '是否确定通过试讲',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            wx.showLoading();
            http.postPromise('/StudentDemand/updateAdoptStatus', { demandId: item.sid, status: 4, teacherId: item.teacherId }).then(data => {
              wx.hideLoading();
              this.onGoPay()
            }).catch(e => wx.hideLoading())
          }
        },
      });
    },
  }
})
