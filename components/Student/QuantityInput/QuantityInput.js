// components/Student/QuantityInput/QuantityInput.js

const chackNum = function (value, min, max) {
  if (value > max) {
    return max
  } else if (value < min) {
    return min
  }
  return value
}

const checkInputValue = function (value, _value) {
  return `${_value === '' ? _value : value}`
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    min: {
      type: Number,
      value: 0,
      observer(min) {
        const { value, max, _value } = this.data
        this.setData({ _value: checkInputValue(chackNum(value, min, max), _value) })
      }
    },

    max: {
      type: Number,
      value: 9e10,
      observer(max) {
        const { value, min, _value } = this.data
        this.setData({ _value: checkInputValue(chackNum(value, min, max), _value) })
      }
    },

    value: {
      type: Number,
      value: 1,
      observer(value) {
        const { max, min, _value } = this.data
        this.setData({ _value: checkInputValue(chackNum(value, min, max), _value) })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _value: '1'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const { max, min } = this.data
      const value = chackNum(Number(e.detail.value), min, max)
      this.setData({ _value: checkInputValue(value, e.detail.value) })
      this.triggerEvent('onChange', value)
    },

    onAddClick() {
      const { max, min } = this.data
      const value = chackNum(Number(this.data._value) + 1, min, max)
      this.setData({ _value: value })
      this.triggerEvent('onChange', value)
    },

    onSubClick() {
      const { max, min } = this.data
      const value = chackNum(Number(this.data._value) - 1, min, max)
      this.setData({ _value: value })
      this.triggerEvent('onChange', value)
    },
  }
})
