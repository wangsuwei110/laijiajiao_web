var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    isIPX: getApp().isIPX,
    achievement: {
      name: "",
      desc: "",
      pic: []
    }
  },
  getAchievementName: function (e) {
    //console.log(e.detail.value)
    this.data.achievement.name = e.detail.value;
  },
  getAchievementDesc: function (e) {
    //console.log(e.detail.value)
    this.data.achievement.desc = e.detail.value;
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
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
        if (data.code === '200') {
          that.setData({
            'achievement.pic': that.data.achievement.pic.concat(data.data.url)
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
  /**
   * 删除图片
   */
  removePic: function (e) {
    var list = this.data.achievement.pic
    list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      'achievement.pic': list
    })
  },
  /**
   * 新增成功案例 
   */
  addAchievement: function () {
    var _achievement = this.data.achievement
    var tipText = ''
    if (_achievement.name.trim() === '') {
      tipText = '请输入成功案例标题'
    } else if (_achievement.desc.trim() === '') {
      tipText = '请输入成功案例具体描述'
    } else if (_achievement.pic.length <= 0) {
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
      type: 'experience',
      pictureTitle: _achievement.name,
      pictureDesc: _achievement.desc,
      pictureUrl: _achievement.pic.join(',')
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