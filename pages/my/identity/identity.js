var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    isIPX: getApp().isIPX,
    userinfo: {
      IDcardNumber: "",
      IDcardPic: [],
      logonStatus: 1
    }
  },
  getIDcardNumber: function (e) {
    this.setData({
      'userinfo.IDcardNumber': e.detail.value
    })
  },
  uploadImg: function () {
    var that = this;
    var _userinfo = this.data.userinfo
    if (_userinfo.IDcardPic.length >= 2) {
      wx.showToast({
        title: '身份证照片为正反两张，不能超过2张',
        icon: 'none'
      })
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.uploadFile(res.tempFilePaths[0])
      },
    })
  },
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
            'userinfo.IDcardPic': that.data.userinfo.IDcardPic.concat(that.data.RESOURCE_PERFIX + data.data.url)
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
  /**
   * 删除图片
   */
  removePic: function (e) {
    var list = this.data.userinfo.IDcardPic
    list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      'userinfo.IDcardPic': list
    })
  },
  saveUserinfo: function () {
    var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
    var _userinfo = this.data.userinfo
    var tipText = ''
    console.log(reg.test(_userinfo.IDcardNumber))
    if (!reg.test(_userinfo.IDcardNumber)) {
      tipText = '请输入正确的身份证号'
    } else if (_userinfo.IDcardPic.length <= 0) {
      tipText = '请上传身份证照片'
    }
    if (tipText !== '') {
      wx.showToast({
        title: tipText,
        icon: 'none'
      })
      return
    }
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      idCard: _userinfo.IDcardNumber,
      pictureUrl: _userinfo.IDcardPic.join(',')
    }
    wx.showLoading()
    http.post('/userInfo/update', params, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      if (res.code === '200') {
        wx.navigateBack()
      }
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  },
  getIDCardInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      pictureType: 2
    }
    wx.showLoading()
    http.post('/userInfo/queryTeacherInfoByType', params, function (res) {
      var pics = res.data.pictures[0].pictureUrl
      // var _pics = []
      // if (pics.length > 0) {
      //   pics.forEach(function (p) {
      //     p = that.data.RESOURCE_PERFIX + p
      //     _pics.push(p)
      //   })
      // }
      that.setData({
        'userinfo.IDcardPic': pics,
        'userinfo.logonStatus': res.data.userInfos.logonStatus,
        'userinfo.IDcardNumber': res.data.userInfos.idCard
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
  previewImg: function (e) {
    wx.previewImage({
      current: e.target.dataset.url,
      urls: e.target.dataset.urls
    })
  },
  onLoad: function () {
    this.getIDCardInfo()
  }
})