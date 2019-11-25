// components/Student/HomeNav/HomeNav.js
var appInst = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    independent: {
      type: Boolean,
      value: false,
    },

    showTop:{
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIPhoneX: appInst.isIPX,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onToTop() {
      this.triggerEvent('onToTop')
    }
  }
})
