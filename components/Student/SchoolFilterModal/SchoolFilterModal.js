// components/Student/SchoolFilterModal/SchoolFilterModal.js
const http = require('../../../utils/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ///teacher/listUniversity
  /**
   * 组件的方法列表
   */
  methods: {

  },

  attached() {
    http.postPromise('/teacher/listUniversity', { schoolAndProvince: '' }).then(data => {
      
    })
  }
})
