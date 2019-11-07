var http = require('../../../utils/api.js')
Page({
  data: {
    orderType: null,
    id: null
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      'orderType': options.orderType,
      id: options.id
    })
    that.getOrderDetails()
  },
  getOrderDetails () {
    var that = this
    http.post('/teacher/queryStudemtDemandDetail', {teacherId: 6, demandId: this.data.id}, function (res) {
      console.log(res.data)
      var data = res.data
      if (res.code === '200') {
       console.log(data)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }, function (err) {
      console.log(err)
    }, function () {
      wx.hideLoading()
    })
  } 
})