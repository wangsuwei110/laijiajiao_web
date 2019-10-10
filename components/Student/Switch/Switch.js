// components/Student/Switch/Switch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Array,
      value: [],
    },

    value: {
      type: Number,
      value: 0,
    },

    valueKey: {
      type: String,
      value: 'key'
    },
    nameKey: {
      type: String,
      value: 'name'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const index = Number(e.currentTarget.dataset.index)
      const item = this.data.options[index]
      this.setData({ value: item[this.data.valueKey] })
      this.triggerEvent('onChange', {
        value: item[this.data.valueKey],
        option: item,
      })
    }
  }
})
