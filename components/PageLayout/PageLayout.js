// components/PageLayout/PageLayout.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isStudent: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: '0px'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onScrollToLower() {
      this.triggerEvent('onScrollToLower')
    }
  },
  
  ready() {
    const query = this.createSelectorQuery()
    query.select('#bottomNavigation').boundingClientRect(res => {
      //console.log(res.height, wx.getSystemInfoSync())
      this.setData({
        height: `${wx.getSystemInfoSync().windowHeight - res.height}px`
      })
    })
    query.exec()
  },
})
