// components/Student/SubjectFilterModal/SubjectFilterModal.js
const http = require('../../../utils/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(show, old) {
        console.log(show, old)
        if (show && !old && !this.loaded) {
          this.loaded = true
          http.getPromise('/teacher/listSubject').then(data => {
            
          })
        }
      }
    },
    subjects: {
      type: Array,
      value: []
    },
  },

  loaded: false,

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  attached() {

  }
})
