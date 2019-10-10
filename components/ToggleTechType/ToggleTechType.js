// components/ToggleTechType/ToggleTechType.js

const Observer = function (options, value, valueKey, nameKey) {
  const selectedList = options.map(item => !!value.find(id => item[valueKey] === id))
  const names = options.filter((item, index) => selectedList[index]).map(item => item[nameKey]).join(',')
  this.setData({ selectedList, names })
}

Component({
  /* options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  }, */
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: String,
      value: ''
    },
    options: {
      type: Array,
      value: [],
      observer: function (options) {
        const { value, valueKey, nameKey } = this.data
        Observer.call(this, options, value, valueKey, nameKey)
      }
    },

    placeholder: {
      type: String,
      value: ''
    },

    value: {
      type: Array,
      value: [],
      observer: function (value) {
        const { options, valueKey, nameKey } = this.data
        Observer.call(this, options, value, valueKey, nameKey)
      }
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

    multiple: {
      type: Boolean,
      value: true
    }
  },



  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    selectedList: [],
    names: ''
  },

  /*  observers: {
     'selectedList': function (selectedList) {
       const { options, nameKey } = this.data
       
       console.log(names)
       this.setData({
         names
       })
     }
   }, */

  /**
   * 组件的方法列表
   */
  methods: {
    onToggleModal() {
      this.setData({ show: !this.data.show })
    },

    onCancel() {
      this.setData({ show: false })
    },

    onItemClick(e) {
      let { selectedList, multiple, show, options, nameKey, valueKey } = this.data
      const index = Number(e.currentTarget.dataset.index)
      const checked = multiple ? !selectedList[index] : true



      if (multiple) {
        selectedList[index] = checked
      } else {
        selectedList = selectedList.map((item, _index) => index === _index)
      }

      const _selectedList = options.filter((item, index) => selectedList[index])

      const names = _selectedList.map(item => item[nameKey]).join(',')

      this.triggerEvent('onChange', { value: _selectedList.map(item => item[valueKey]) })

      this.setData({ selectedList, show: multiple ? show : false, names })
    }
  }
})
