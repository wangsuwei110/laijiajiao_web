// components/SubjectPicker/SubjectPicker.js
const http = require('../..//utils/api')
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

    value: {
      type: Array,
      value: [0, 0, 0],
      observer(value) {
        this.fetchFirstGrade(value)
        //const {firstList} = this.data
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    firstList: [],
    secondObj: {},
    thridObj: {},
    firstNameList: [],
    secondNameList: [],
    thridNameList: [],
    selected: [0, 0, 0],
    names: '',
    nameList: [],
  },



  /**
   * 组件的方法列表
   */
  methods: {

    onCurriulumChang(e) {
      const list = e.detail.value
      const { firstList, secondObj, thridObj } = this.data
      const firstItem = firstList[list[0]]
      const secondItem = secondObj[firstItem.key][list[1]]
      const thirdItem = thridObj[secondItem.key][list[2]]

      this.setData({ names: thirdItem.value })
      this.triggerEvent('onChange', {
        value: [firstItem.key, secondItem.key, thirdItem.key]
      })
    },

    onCurriulumCancel() {

    },

    onColumnChange(e) {
      //console.log(e.detail)
      const { firstList, secondObj, selected } = this.data
      const index = Number(e.detail.value)
      //console.log(e.detail)
      if (e.detail.column === 0) {
        selected[index, 0, 0]
        const item = firstList[index]
        this.fetchSecondGrade(item.key)
        this.level = item.key
        selected[selected[0], index, 0]
      } else if (e.detail.column === 1) {
        const item = secondObj[this.level][index]
        this.fetchThirdGrade(item.key)
      } else {
        selected[2] = index
      }

      this.setData(selected)
    },

    generatePickerList(list) {
      return list.map(item => item.value)
    },

    setPickerIndex(list, value, level) {

      const { selected, nameList } = this.data
      const index = list.findIndex(item => item.key === value)
      selected[level] = index < 0 ? 0 : index
      console.log(this.nameList, index, list, value, level)
      nameList[level] = list[index] ? list[index].value : ''
      this.setData({ selected, nameList })
    },

    fetchFirstGrade(value) {
      const { firstList } = this.data
      if (firstList.length) {
        value && this.setPickerIndex(firstList, value[0] || firstList[0].key, 0)
      } else {
        http.postPromise('/teacher/listSubject', {}).then(data => {
          this.setData({
            firstNameList: this.generatePickerList(data.data),
            firstList: data.data
          })
          if (value) {
            this.setPickerIndex(data.data, value[0], 0)
            this.fetchSecondGrade(value[0] || data.data[0].key, value)
          } else {
            this.fetchSecondGrade(data.data[0].key)
          }
          //this.level = data.data[0].key

        })
      }

    },

    fetchSecondGrade(teachLevel, value) {
      const { secondObj } = this.data
      this.level = teachLevel
      //console.log(secondObj, secondObj[teachLevel])
      if (secondObj[teachLevel]) {
        //this.fetchThirdGrade(secondObj[teachLevel][0].key)
        if (value) {
          this.setPickerIndex(secondObj[teachLevel], value[1], 1)
          this.fetchThirdGrade(value[1] || secondObj[teachLevel][0].key, value)
        } else {
          this.fetchThirdGrade(secondObj[teachLevel][0].key)
        }


        this.setData({
          secondNameList: this.generatePickerList(secondObj[teachLevel])
        })
      } else {
        http.postPromise('/teacher/listSubject', { teachLevel }).then(data => {
          secondObj[teachLevel] = data.data
          this.setData({
            secondNameList: this.generatePickerList(data.data),
            secondObj
          })

          if (value) {
            this.setPickerIndex(data.data, value[1], 1)
            this.fetchThirdGrade(value[1] || data.data[0].key, value)
          } else {
            this.fetchThirdGrade(data.data[0].key)
          }
        })
      }
    },


    fetchThirdGrade(teachGrade, value) {
      const { thridObj, nameList } = this.data
      //console.log(thridObj, thridObj[teachGrade])
      if (thridObj[teachGrade]) {
        this.setData({
          thridNameList: this.generatePickerList(thridObj[teachGrade])
        })
        
        if (value) {
          this.setPickerIndex(thridObj[teachGrade], value[2], 2)
          this.setData({ name: nameList[2] })
        }
      } else {
        http.postPromise('/teacher/listSubject', { teachGrade, teachLevel: this.level }).then(data => {
          thridObj[teachGrade] = data.data
          this.setData({
            thridObj,
            thridNameList: this.generatePickerList(data.data)
          })
          
          if (value) {
            this.setPickerIndex(data.data, value[2], 2)
            this.setData({ name: nameList[2] })
          }

        })
      }
    },

  },

  attached() {
    this.fetchFirstGrade()
  }

})
