// components/DropDown/DropDown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isEnd: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: null
  },


  /**
   * 组件的方法列表
   */
  methods: {
    reAnimation() {
      this.animation.rotate(0).step({ duration: 0 }) // 重置动画
      this.setData({ animationData: this.animation.export() })
      setTimeout(() => {
        this.animation.rotate(360).step()
        this.setData({ animationData: this.animation.export() })
      }, 60)// 播放下一次动画
    },
  },

  ready() {
    this.animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease-in-out',
      delay: 0,
      transformOrigin: '50% 50% 0',
    })
    this.animation.rotate(360).step()
    this.setData({ animationData: this.animation.export() })
  },
})
