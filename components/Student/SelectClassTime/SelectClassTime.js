// components/Student/SelectClassTime/SelectClassTime.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    weekData: {
      type: Array,
      value: [],
      observer(weekData) {
        const _weekData = {}
        weekData.map(item => {
          _weekData[item.week] = _weekData[item.week] || {}
          _weekData[item.week][item.time] = true
        })

        this.setData({ _weekData })
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _weekData: {},
    week: Array.from({ length: 7 }).map((item, index) => index + 1),
    dataList: [
      {
        id: 1,
        name: '上午',
        time: '（08:00-12:00）',
      },
      {
        id: 2,
        name: '下午',
        time: '（12:00-18:00）',
      },
      {
        id: 3,
        name: '晚上',
        time: '（18:00-23:00）',
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onWeekChange(e) {
      const { _weekData } = this.data
      const week = Number(e.currentTarget.dataset.week)
      const time = Number(e.currentTarget.dataset.time)
      if (_weekData[week] && _weekData[week][time]) {
        delete _weekData[week][time]
      } else {
        const data = _weekData[week] || {}
        data[time] = true
        _weekData[week] = data
      }

      const weekList = Object.keys(_weekData).reduce((list, week) => {
        return [...list, ...Object.keys(_weekData[week]).map(time => ({ week: Number(week), time: Number(time) }))]
      }, [])
      //console.log(weekList)
      this.triggerEvent('onChange', weekList)

      this.setData({ _weekData })
    },
  }
})
