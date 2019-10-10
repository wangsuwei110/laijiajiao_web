var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    isIPX: getApp().isIPX,
    userinfo: {}
  },
  getTeachName: function (e) {
    this.setData({ 'userinfo.teacherName': e.detail.value })
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
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
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
        console.log(err)
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
    wx.showLoading({'mask': true})
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      teacherName: _userinfo.teacherName,
      weiChar: _userinfo.weiChar,
      pictureUrl: _userinfo.headPicture,
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