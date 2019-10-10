Page({
  data: {},
  onLoad: function () {
  },
  /**
   * 家教需求列表 
   */
  demandList: function () {
    wx.navigateTo({
      url: '../demandList/demandList',
    })
  },
  /**
   * 家教需求详情
   */
  demandDetail: function () {
    wx.navigateTo({
      url: '../demandDetail/demandDetail?id=41241',
    })
  }
})
