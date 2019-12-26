var http = require('../../utils/api.js');
Page({
  data: {
    userInfo: {},
    phone: '',  // 手机号码
    code: '', // 短信验证码
    codeText: '获取验证码',
    isClick: true
  },
  // 手机号码
  getPhone: function (e) {
    this.setData({ 'phone': e.detail.value })
  },
  // 验证码
  getCode: function (e) {
    this.setData({ 'code': e.detail.value })
  },
  // 获取短信验证码
  getVerificationCode: function () {
    var that = this;
    var phoneReg = /^1[34578]\d{9}$/;

    if (!this.data.isClick) { return; }

    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        mask: true
      })
      return;
    }

    this.setData({ 'isClick': false })
    var num = 60;
    var timer = setInterval(function () {
      num--;
      if (num === 0) {
        clearInterval(timer)
        that.setData({
          'codeText': '获取验证码',
          'isClick': true
        })
      } else {
        that.setData({ 'codeText': '等待' + num + '秒' })
      }
    }, 1000)

    http.post('/smsVerifityCode/sendMessage', {
      loginPhone: this.data.phone
    }, function (res) {
      wx.showToast({
        title: '验证码发送成功',
        icon: 'none'
      })
    }, function (err) {
      console.error(err)
      wx.showToast({
        title: '获取验证码失败，请稍后重新获取',
        icon: 'none'
      })
    }, function () {
    })
  },
  // 打开学员端页面
  openStudent: function () {
    wx.reLaunch({
      url: '/pages/Student/Login/Login'
    })
  },
  // 登录、注册账号
  onGotUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo) {
      const { avatarUrl, gender } = e.detail.userInfo
      wx.login({
        success(res) {
          if (res.code) {
            var params = {
              code: res.code
            }
            if (that.data.phone === '') {
              wx.showToast({
                title: '请输入手机号码',
                icon: 'none'
              })
              return;
            } else if (that.data.code === '') {
              wx.showToast({
                title: '请输入验证码',
                icon: 'none'
              })
              return;
            }
            wx.showLoading({
              title: '登录中...',
            })
            wx.setStorage({
              key: "code",
              data: res.code
            })
            http.post('/user/getOpenId', params, function (res) {
              var openId = res.data.openid
              that.login(openId, gender, avatarUrl)
            }, function (err) {
              wx.showToast({
                title: err.msg,
                icon: 'none'
              })
            }, function () {

            })
          } else {
            that.setData({
              'codeText': '获取验证码',
              'isClick': true
            })
            wx.showToast({
              title: res.errMsg,
            });
          }
        }
      })
    }
  },
  goTo() {
    wx.reLaunch({
      url: '/pages/noHome/index'
    })
  },
  login: function (openId, gender, headPicture) {
    var params = {
      loginPhone: this.data.phone,
      identifyCode: this.data.code,
      loginType: 2, // 1: 学生，2：老师
      gender: gender, // 0：未知、1：男、2：女
      openId: openId,
      headPicture
    }
    http.post('/user/login', params, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      wx.setStorageSync('user_id', res.data.teacherId)
      wx.setStorageSync('user_name', res.data.teacherName)
      wx.setStorageSync('user_phone', res.data.telephone)
      wx.setStorageSync('registerDate', res.data.registerDate)
      wx.setStorageSync('vacationStatus', res.data.vacationStatus)
      wx.setStorageSync('auditStatus', res.data.auditStatus)
      wx.setStorageSync('user_type', 2)
      if (!res.data.teacherName || res.data.teacherName == '') {
        wx.redirectTo({
          url: '/pages/editUserinfo/editUserinfo',
        })
      } else {
        wx.switchTab({
          url: '/pages/home/index/index',
        })
      }
    }, function (err) {
      wx.showToast({
        title: '登录出错，请稍后再试',
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  }
})
