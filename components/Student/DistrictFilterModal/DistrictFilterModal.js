// components/Student/DistrictFilterModal/DistrictFilterModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    address: {
      type: Array,
      value: []
    },
    addressId: {
      type: Number,
      value: 0
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
      const addressId = Number(e.currentTarget.dataset.value)
      this.triggerEvent('onChange', { addressId })
    },
  }
})
