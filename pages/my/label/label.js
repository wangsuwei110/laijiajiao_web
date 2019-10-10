var http = require('../../../utils/api.js')
Page({
  data: {
    labels: [],
    ids: []
  },
  getLabes: function () {
    var that = this
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      parentId: 62
    }
    wx.showLoading()
    var _ids = []
    http.post('/parameter/queryParameters', params, function (res) {
      var data = res.data[0]
      if (data.teacherTag.length > 0) {
        data.teacherTag.forEach(function (item) {
          if (item.flag) {
            _ids.push(item.parameterId)
          }
        })
      }
      that.setData({
        'labels': data.teacherTag,
        'ids': _ids
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
  toggleTagStatus: function (e) {
    var dataset = e.currentTarget.dataset
    var tagStatus = dataset.flag
    var index = dataset.index
    var id = dataset.id
    var ids = this.data.ids
    !tagStatus ? ids.push(id) : ids.splice(ids.indexOf(id), 1)
    this.setData({
      ['labels[' + index + '].flag']: !tagStatus,
      ids: ids
    })
  },
  saveUserinfoTags: function () {
    console.log(this.data.ids)
    var params = {
      teacherId: wx.getStorageSync('user_id'),
      tag: this.data.ids.join(',')
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
  onLoad: function (options) {
    this.getLabes()
  }
})