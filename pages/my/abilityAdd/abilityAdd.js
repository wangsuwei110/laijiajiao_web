var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    isIPX: getApp().isIPX,
    ability: {
      name: "",
      pic: []
    }
  },
  onLoad: function () {
  },
  getAbilityName: function (e) {
    console.log(e.detail.value)
    this.data.ability.name = e.detail.value
  },
  uploadImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
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
        if (that.data.ability.pic.length > 0) {
          wx.showToast({
            title: '只能上传一张照片',
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
        that.setData({
          'ability.pic': that.data.ability.pic.concat(data.data.url)
        })
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
    var list = this.data.ability.pic
    list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      'ability.pic': list
    })
  },
  addAbility: function () {
    var _ability = this.data.ability
    var tipText = ''
    if (_ability.name.trim() === '') {
      tipText = '请输入标题'
    } else if (_ability.pic.length <= 0) {
      tipText = '请上传证明照片'
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
      type: 'certificate',
      pictureTitle: _ability.name,
      pictureUrl: _ability.pic.join(',')
    }
    wx.showLoading()
    http.post('/userInfo/update', params, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      wx.navigateBack()
    }, function (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }, function () {
      wx.hideLoading()
    })
  }
})