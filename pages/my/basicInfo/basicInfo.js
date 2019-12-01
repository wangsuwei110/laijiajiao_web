var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    isIPX: getApp().isIPX,
    userinfo: {
      headPicture: '',
      teacherName: '',
      home: '',
      address: '',
      weiChar: '',
      QQ: ''
    }
  },
  getTeachName: function (e) {
    this.setData({ 'userinfo.teacherName': e.detail.value })
  },
  getAddress: function (e) {
    this.setData({ 'userinfo.address': e.detail.value })
  },
  getWeiChar: function (e) {
    this.setData({ 'userinfo.weiChar': e.detail.value })
  },
  getQQ: function (e) {
    this.setData({ 'userinfo.QQ': e.detail.value })
  },
  bindRegionChange: function (e) {
    this.setData({
      'userinfo.home': e.detail.value[0] + ' ' + e.detail.value[1]
    })
  },
  // 上传头像
  updateAvatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        //console.log(res)
        that.setData({
          ["userinfo.headPicture"]: res.tempFilePaths[0]
        })
        that.uploadFile(res.tempFilePaths[0])
      }
    })
  },
  /**
   * 上传图片
   * @param {Object} params 图片文件对象
   */
  uploadFile: function (params) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: http.BASE_URL + '/upload/uploadFile',
      filePath: params,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': wx.getStorageSync('token') || ''
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
        if (data.code === '200') {
          that.setData({
            'userinfo.headPicture': data.data.url
          })
        }
      },
      fail: function (err) {
        //console.log(err)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '上传进度' + res.progress + '%'
      })
      if (res.progress === 100) {
        wx.hideLoading()
      }
    })
  },
  saveUserinfo: function () {
    var _userinfo = this.data.userinfo
    //console.log(typeof _userinfo.teacherName)
    //console.log(typeof _userinfo.weiChar)
    var tipText = ''
    if (!_userinfo.headPicture) {
      tipText = '请上传头像'
    } else if (_userinfo.teacherName == '' || !_userinfo.teacherName) {
      tipText = '请输入姓名'
    } else if (_userinfo.home == '' || !_userinfo.home) {
      tipText = '请选择籍贯'
    } else if (_userinfo.address == '' || !_userinfo.address) {
      tipText = '请输入详细住址'
    }
    //  else if (_userinfo.weiChar.trim() == '') {
    //   tipText = '请输入微信号'
    // } else if (_userinfo.QQ.trim() == '') {
    //   tipText = '请输入QQ号'
    // }
    if (tipText != '') {
      wx.showToast({
        title: tipText,
        icon: 'none'
      })
      return
    }
    wx.showLoading({'mask': true})
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      teacherName: _userinfo.teacherName,
      weiChar: _userinfo.weiChar,
      pictureUrl: _userinfo.headPicture,
      address: _userinfo.address,
      home: _userinfo.home,
      qqh: _userinfo.QQ,
      pictureType: 1
    }
    http.post('/userInfo/update', params, function (res) {
      wx.navigateBack()
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },
  getUserInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id')
    }
    wx.showLoading()
    http.post('/userInfo/queryTeacherInfo', params, function (res) {
      that.setData({
        userinfo: res.data
      })
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },
  onLoad: function (options) {
    this.getUserInfo()
  }
})