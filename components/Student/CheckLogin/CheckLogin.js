// components/Student/CheckLogin/CheckLogin.js
Component({
  /**
   * 组件的属性列表
   */

  externalClasses: ['class-name'],
  properties: {
    isStudent: {
      type: Boolean,
      value: false
    },
    url: {
      type: String,
      value: ''
    }
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
    onClick() {
      const { isStudent, url } = this.data
      if (wx.getStorageSync('user_id')) {
        if (url) {
          wx.navigateTo({
            url
          })
        }
        this.triggerEvent('onClick')
      } else {
        wx.showModal({
          title: '提示',
          content: '需要先验证手机号，是否立即验证？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.navigateTo({
                url: isStudent ? '/pages/Student/Login/Login' : '/pages/login/login',
              });
            }
          },
          fail: () => { },
          complete: () => { }
        });
      }
    }
  }
})
