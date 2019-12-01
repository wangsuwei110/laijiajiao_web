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
        //console.log(show, old)
        if (show && !old && !this.loaded) {
          this.loaded = true
          http.postPromise('/teacher/findAllSubject', {}).then(data => {
            this.setData({ list: [{ key: 0, value: '全部' }, ...data.data] })
          })
        }
      }
    },
  },

  loaded: false,

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    subjects: {
      0: [
        { key: 0, value: '全部' }
      ]
    },
    subject: 0,
    level: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchSubject(e) {
      const id = Number(e.currentTarget.dataset.id)
      const { subjects } = this.data
      //console.log(subjects)
      if (!subjects[id]) {
        http.postPromise('/teacher/findAllSubject', { teachLevel: id }).then(data => {
          subjects[id] = data.data
          this.setData({ subjects, level: id, subject: 0 })
        })
      } else {
        this.setData({ level: id, subject: 0 })
      }
    },


    onChange(e) {
      const id = Number(e.currentTarget.dataset.id)
      this.setData({ subject: id })
      this.triggerEvent('onChange', { subjectId: id || null })
    },
  },
  
  attached() {

  }
})
