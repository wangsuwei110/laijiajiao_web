Page({
  data: {
    orderType: null,
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      'orderType': options.orderType
    })
  }
})