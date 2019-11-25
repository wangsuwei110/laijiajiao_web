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
    },
    absolute: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: '0px',
    bottom: '0px',
    scrollTop: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onScrollToLower() {
      this.triggerEvent('onScrollToLower')
    },

    onScroll(event) {
      const { scrollTop } = event.detail
      const top = this.top || 0
      let showTop = null
      if (scrollTop > 0 && top <= 0) {
        showTop = true
      } else if (top > 0 && scrollTop <= 0) {
        showTop = false
      }
      //console.log(showTop, scrollTop, top)

      showTop === null || this.triggerEvent('onShowTop', showTop)

      this.top = scrollTop

      //this.data.scrollTop === '' || this.setData({ scrollTop: '' })
    },

    onToTop() {
      this.top = 0
      //console.log('oooo')
      this.setData({ scrollTop: 0 })
    }
  },

  ready() {
    const query = this.createSelectorQuery()
    query.select('#bottomNavigation').boundingClientRect(res => {
      //console.log(res.height, wx.getSystemInfoSync())
      this.setData({
        bottom: `${res.height}px`,
        height: `${wx.getSystemInfoSync().windowHeight - res.height}px`
      })
    })
    query.exec()
  },
})
