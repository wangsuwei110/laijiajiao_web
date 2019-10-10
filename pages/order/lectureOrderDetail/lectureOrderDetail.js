Page({data: {
    isIPX: getApp().isIPX,
    selectedPeriod: '',
    period: {
      morning: ['08:00','09:00','10:00','11:00','12:00'],
      noon: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      evening: ['19:00', '20:00', '21:00', '22:00', '23:00']
    }
  },
  onLoad: function (options) {

  }
})