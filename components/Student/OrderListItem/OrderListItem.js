// components/Student/OrderListItem/OrderListItem.js
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

    onPassClick() {
      const { item } = this.data
      this.setCacheItem()
      wx.navigateTo({
        url: `/pages/Student/OrderPass/OrderPass?id=${item.sid}`,
      });
    },
  }
})
