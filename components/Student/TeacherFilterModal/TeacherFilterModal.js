// components/Student/TeacherFilterModal/TeacherFilterModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(show, old) {
        if (!show && old) {
          const { type, sex } = this.data
          console.log(type, sex)
          this.setData({ _type: type === null ? -1 : type, _sex: sex === null ? 0 : sex })
        }
      },
    },
    type: {
      type: Number,
      value: -1,
      observer(type) {
        console.log(type)
        this.setData({ _type: type === null ? -1 : type })
      },
    },
    sex: {
      type: Number,
      value: 0,
      observer(sex) {
        this.setData({ _sex: sex === null ? 0 : sex })
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _sex: 0,
    _type: -1,
    statusList: [
      {
        key: -1,
        name: '不限',
      },
      {
        key: 0,
        name: '在校',
      },
      {
        key: 1,
        name: '毕业',
      },
    ],
    grenderList: [
      {
        key: 0,
        name: '不限'
      },
      {
        key: 1,
        name: '男'
      },
      {
        key: 2,
        name: '女'
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onStatusChange(e) {
      this.setData({ _type: Number(e.currentTarget.dataset.value) })
    },

    onSexChange(e) {
      this.setData({ _sex: Number(e.currentTarget.dataset.value) })
    },

    onSubmitClick() {
      const { _type: type, _sex: sex } = this.data
      this.triggerEvent('onChange', { type: type >= 0 ? type : null, sex: sex > 0 ? sex : null })
    }
  }
})
