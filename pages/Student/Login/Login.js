// pages/Student/Login/Login.js

const util = require('../../../utils/util')
const http = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seconds: 61,
    phone: '',
    code: '',
  },

  isSending: false,


  onPhoneChange(e) {
    this.setData({ phone: e.detail.value })
  },


  onCodeChange(e) {
    this.setData({ code: e.detail.value })
  },

  onSendCode: util.serverThrottle(function () {
    if (!this.isSending) {
      const { phone } = this.data
      if (!phone || !/^1\d{10}$/.test(phone)) {
        return wx.showToast({
          title: '请输入11位手机号码',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }

      this.isSending = true

      return http.postPromise('/smsVerifityCode/sendMessage', { loginPhone: phone }).then(e => {
        wx.showToast({
          title: '验证码发送成功',
          icon: 'none'
        })
        this.subSecond()
      }).catch(err => {
        err && wx.showToast({
          title: '获取验证码失败，请稍后重新获取',
          icon: 'none'
        })
        this.isSending = false
      })
    }
  }),


  onLogin(gender) {
    wx.login({
      success: resData => {
        if (resData.code) {
          const { phone, code } = this.data
          let res = '';
          if (!phone || !/^1\d{10}$/.test(phone)) {
            res = '请输入11位手机号码'
          } else if (!code) {
            res = '请输入验证码'
          }

          if (res) {
            return wx.showToast({
              title: res,
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false,
            });
          } else {
            wx.showLoading({
              title: '登录中...',
            })

            http.postPromise('/user/getOpenId', { code: resData.code }).then(data => {
              this.login(data.data.openid, gender)
            }).catch(err => {
              err && wx.showToast({
                title: err.msg,
                icon: 'none'
              })
            })
          }

        } else {
          wx.showToast({
            title: res.errMsg,
          });
        }
      }
    })
  },

  // 登录、注册账号
  onGotUserInfo: function (e) {
    //console.log(e)
    if (e.detail.userInfo) {
      //var gender = e.detail.userInfo.gender
      this.onLogin(e.detail.userInfo.gender)
    }
  },

  login: function (openId, gender) {
    var params = {
      loginPhone: this.data.phone,
      identifyCode: this.data.code,
      loginType: 1, // 1: 学生，2：老师
      gender: gender, // 0：未知、1：男、2：女
      openId: openId
    }
    http.postPromise('/user/login', params).then(res => {
      wx.setStorageSync('user_id', res.data.studentId)
      wx.setStorageSync('user_name', res.data.studentName)
      wx.setStorageSync('user_phone', this.data.phone)
      wx.setStorageSync('user_type', 1)
      if (!res.data.studentName) {
        wx.redirectTo({
          url: '/pages/Student/LoginInfo/LoginInfo',
        })
      } else {
        wx.reLaunch({
          url: '/pages/Student/index/index',
        })
      }
    }).catch(err => {
      /* err && wx.showToast({
        title: '登录出错，请稍后再试',
        icon: 'none',
        duration: 2000,
      }) */

      wx.showToast({
        title: err,
        icon: 'none',
        duration: 2000,
      })

    }).then(() => {
      wx.hideLoading()
    })
  },


  subSecond() {
    let { seconds } = this.data
    if (seconds <= 0) {
      this.isSending = false
      this.setData({ seconds: 61 })
    } else {
      seconds--
      this.setData({ seconds })
      setTimeout(this.subSecond, 1000);
    }
  }
})