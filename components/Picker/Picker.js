// components/Picker/Picker.js

const Observer = function (options, value, valueKey, nameKey) {
  const activeIndex = options.findIndex(item => item[valueKey] === value)
  this.setData({ activeIndex, names: options[activeIndex] ? options[activeIndex][nameKey] : '', dataList: options.map(item => item[nameKey]) })
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    label: {
      type: String,
      value: ''
    },
    custom: {
      type: Boolean,
      value: false,
    },

    options: {
      type: Array,
      value: [],
      observer: function (options) {
        const { value, valueKey, nameKey } = this.data
        Observer.call(this, options, value, valueKey, nameKey)
      }
    },

    value: {
      type: Number,
      value: 0,
    },

    valueKey: {
      type: String,
      value: 'key',
      observer: function (valueKey) {
        const { options, value, nameKey } = this.data
        Observer.call(this, options, value, valueKey, nameKey)
      }
    },
    nameKey: {
      type: String,
      value: 'name',
      observer: function (nameKey) {
        const { options, value, valueKey } = this.data
        Observer.call(this, options, value, valueKey, nameKey)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: -1,
    dataList: [],
    names: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const index = Number(e.detail.value)
      const { options, valueKey, nameKey } = this.data
      this.setData({ activeIndex: index, names: options[index][nameKey] })
      this.triggerEvent('onChange', { value: options[index][valueKey], data: options[index] })
    },
  }
})
