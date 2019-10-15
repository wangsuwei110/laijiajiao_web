App({
  onLaunch: function () {
    // 获取手机信息
    let sysModel = wx.getSystemInfoSync().model;
    if (sysModel.indexOf('iPhone X') != -1) {
      this.isIPX = true;
    }

    var token = wx.getStorageSync('token')
    var userName = wx.getStorageSync('user_name')
    var userType = wx.getStorageSync('user_type') || 1
    if (token) {
      /* if (userName == null || userName == '') {
        wx.reLaunch({
          url: userType === 1 ? '/pages/Student/LoginInfo/LoginInfo' : '/pages/editUserinfo/editUserinfo',
        })

      } else {
        wx.switchTab({
          url: userType === 1 ? '/pages/Student/index/index' : '/pages/home/index/index',
        })
      }
    } else {
      wx.reLaunch({
        url: userType === 1 ? '/pages/Student/Login/Login' : '/pages/login/login',
      })
    } */
  },
  isIPX: false
})