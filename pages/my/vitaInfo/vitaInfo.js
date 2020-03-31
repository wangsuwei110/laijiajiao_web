var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    auditStatusStr: '', // 审核状态
    logonStatusStr: '', // 身份认证状态
    experienceStr: '',  // 家教经验
    certificateStr: '', // 能力认证
    userinfo: {},
    resumeComplete: null
  },
  // 基础信息
  basicInfo: function () {
    wx.navigateTo({
      url: '../basicInfo/basicInfo',
    })
  },
  // 身份认证
  attestIdentity: function () {
    wx.navigateTo({
      url: '../identity/identity',
    })
  },
  // 学历信息
  education: function () {
    wx.navigateTo({
      url: '../education/education',
    })
  },
  // 能力认证
  attestAbility: function () {
    wx.navigateTo({
      url: '../ability/ability',
    })
  },
  // 成功案例
  achievement: function () {
    wx.navigateTo({
      url: '../achievement/achievement',
    })
  },
  // 我的标签
  userLabel: function () {
    wx.navigateTo({
      url: '../label/label',
    })
  },
  getUserInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id')
    }
    wx.showLoading()
    var _auditStatusStr = ''  // 审核状态信息
    var _logonStatusStr = ''  // 身份认证信息
    var _certificateStr = ''  // 能力认证
    var _experienceStr = ''  // 家教经验
    http.post('/userInfo/queryTeacherInfo', params, function (res) {
      if (res.code === '200') {
        switch (res.data.auditStatus) {
          case 0:
            _auditStatusStr = '审核中'
            break
          case 1:
            _auditStatusStr = '审核通过'
            break
          case 2:
            _auditStatusStr = '审核不通过'
            break
        }
        switch (res.data.logonStatus) {
          case 0:
            _logonStatusStr = '未认证'
            break
          case 1:
            _logonStatusStr = '已认证'
            break
        }

        switch (Number(res.data.certificate)) {
          case 0:
            _certificateStr = '未填写'
            break
          case 1:
            _certificateStr = '已填写'
            break
          default:
            _certificateStr = '未填写'
        }
        switch (Number(res.data.experience)) {
          case 0:
            _experienceStr = '未填写'
            break
          case 1:
            _experienceStr = '已填写'
            break
          default:
            _experienceStr = '未填写'
        }

        that.setData({
          userinfo: res.data,
          auditStatusStr: _auditStatusStr,
          logonStatusStr: _logonStatusStr,
          certificateStr: _certificateStr,
          experienceStr: _experienceStr
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, function () {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },


  onShowNoticeModal() {
    wx.showModal({
      title: '提示',
      content: '填写正确的基础信息、身份认证、学历信息后您的简历信息才会被审核，审核通过后学员才能看到您。',
      showCancel: false,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
    });
  },

  onLoad: function () {

    wx.requestSubscribeMessage({
      tmplIds: ['1DIuaSZQTzvHEtIPLgzzSAYqKVZAlJHmuF2h_qORl3c']
    })
  },
  onShow: function () {
    this.getUserInfo()
  }
})