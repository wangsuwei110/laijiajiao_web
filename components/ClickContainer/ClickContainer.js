// components/ClickContainer/ClickContainer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: String,
    disabled: Boolean,
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
    onClick() {
      this.trigger('onClick', this.data.value)
    }
  }
})
