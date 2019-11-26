// components/Student/TeacherFilter/TeacherFilter.js

const http = require('../../../utils/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchParams: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 0,
    itemList: ['科目', '区域', '筛选'],
    address: [],
    subjects: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemClick(e) {
      const activeIndex = Number(e.currentTarget.dataset.index)
      this.setData({ activeIndex: activeIndex === this.data.activeIndex ? 0 : activeIndex })
    },

    onStop() { },

    onFilterChange(e) {
      this.triggerEvent('onChange', Object.assign({}, this.searchParams, e.detail))
      this.setData({ activeIndex: 0 })
    },

    onCancel() {
      this.setData({ activeIndex: 0 })
    }
  },

  attached() {
    http.postPromise('/teacher/selectList').then(data => {
      const { address, subjects } = data.data
      address.unshift({ key: 0, value: '不限' })
      subjects.unshift({ key: 0, value: '不限' })
      this.setData({ address, subjects })
    })
  }
})
