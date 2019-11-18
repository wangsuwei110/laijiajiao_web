// components/Student/OrderListItem/OrderListItem.js
const http = require('../../../utils/api')
var appInst = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
  },


  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCacheItem() {
      appInst.globalData.orderItem = this.data.item
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
