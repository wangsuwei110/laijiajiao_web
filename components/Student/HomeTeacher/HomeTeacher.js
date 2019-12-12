// components/Student/HomeTeacher/HomeTeacher.js
const http = require('../../../utils/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    first: {
      type: Boolean,
      value: false,
    },

    item: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    RESOURCE_PERFIX: http.RESOURCE_PERFIX
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
