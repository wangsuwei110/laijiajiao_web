var http = require('../../../utils/api.js')
Page({
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    isIPX: getApp().isIPX,
    userinfo: {
      school: "",
      isGraduate: 0,
      major: "",
      degree: "",
      beginSchoolTime: "",
      eduPic: []
    },
    yearStart: '1990',
    yearEnd: new Date().getFullYear(),
    degree: ['专科', '本科', '研究生', '博士']
  },
  getSchool: function (e) {
    this.setData({
      'userinfo.school': e.detail.value
    })
  },
  getMajor: function (e) {
    this.setData({
      'userinfo.major': e.detail.value
    })
  },
  bindDegreeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      'userinfo.degree': this.data.degree[e.detail.value]
    })
  },
  bindYearChange: function (e) {
    this.setData({
      'userinfo.beginSchoolTime': e.detail.value
    })
  },
  updateGraduation: function (e) {
    this.setData({
      'userinfo.isGraduate': e.target.dataset.isgraduate
    })
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
          console.log(that.data.userinfo)
          that.setData({
            'userinfo.eduPic': that.data.userinfo.eduPic.concat(that.data.RESOURCE_PERFIX + data.data.url)
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
    var list = this.data.userinfo.eduPic
    list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      'userinfo.eduPic': list
    })
  },
  saveEducation: function () {
    // 保存学历信息
    var that = this
    var _userinfo = that.data.userinfo
    var tipText = ''
    if (_userinfo.school.trim() === '') {
      tipText = '请输入所读大学'
    } else if (_userinfo.major.trim() === '') {
      tipText = '请输入所读专业'
    } else if (_userinfo.degree.trim() === '') {
      tipText = '请选择学位'
    } else if (_userinfo.beginSchoolTime.trim() === '') {
      tipText = '请选择入学年份'
    } else if (_userinfo.eduPic.length <= 0) {
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
      school: _userinfo.school,
      isGraduate: _userinfo.isGraduate,
      major: _userinfo.major,
      degree: _userinfo.degree,
      beginSchoolTime: _userinfo.beginSchoolTime,
      pictureUrl: _userinfo.eduPic.join(',')
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
  },
  previewImg: function (e) {
    wx.previewImage({
      current: e.target.dataset.url,
      urls: e.target.dataset.urls
    })
  },
  getEducationInfo: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      pictureType: 3
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
      var _userinfo = res.data.userInfos
      console.log(_userinfo, '111')
      that.setData({
        'userinfo': _userinfo,
        'userinfo.eduPic': pics
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
  onLoad: function () {
    this.getEducationInfo()
  },
})