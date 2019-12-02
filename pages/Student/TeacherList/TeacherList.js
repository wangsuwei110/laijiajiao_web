// pages/Student/TeacherList/TeacherList.js
const http = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */


  /* 
  @ApiModelProperty(value = "科目Id",required = true)
private Integer subjectId;

@ApiModelProperty(value = "区域Id",required = true)
private Integer addressId;

@ApiModelProperty(value = "大学名称id",required = true)
private Integer schoolId;

@ApiModelProperty(value = "是否在校, 0:未毕业,1:已毕业",required = true)
private Integer type;

@ApiModelProperty(value = "性别, 0未知，1男，2女",required = true)
private Integer sex;
  */


  /* 
  // 教员id
private Integer teacherId;

// 教员名称
private String teacherName;

// 学校名字
private String schoolName;

// 当前状态：例如：大二在校
private String currentStatus;

// 教学方向
private List<String> teachBranchSlave;

// 个人标签
private List<String> teacherTag;

// 教员等级
private String teacherLevel;

// 收费标准
private String chargesStandard;

// 性别（0未知，1男，2女）
private Integer sex;
  */

  data: {
    searchData: {
      subjectId: null,
      addressId: null,
      schoolId: null,
      type: null,
      sex: null,
    },
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    teacherList: [],
    pageIndex: 1,
    pageSize: 20,
    isEnd: false,
    showTop: false
  },

  running: false,

  onToTop() {
    this.selectComponent('#pageLayout').onToTop()
    this.setData({ showTop: false })
  },

  onShowTop(e) {
    this.setData({ showTop: e.detail })
  },

  onChange(e) {
    const { searchData } = this.data

    this.setData({ searchData: Object.assign({}, searchData, e.detail) }, () => this.fetchList())
  },

  onCancel() {
    //console.log(this.selectComponent('#teacherFilter'))
    this.selectComponent('#teacherFilter').onCancel()
  },

  fetchList(pageIndex = 1) {

    if (!this.running) {
      this.running = true
      const { searchData, teacherList, pageSize } = this.data
      const { type: isGraduate, sex, schoolId: school, addressId: teachAddress, subjectId: teachBrance } = searchData
      const _searchData = { isGraduate, sex, school, teachAddress, teachBrance, createTime: "2018", teacherPoints: 1 }
      const ___searchData = Object.keys(_searchData).reduce((obj, key) => {
        if (_searchData[key] !== null) {
          obj[key] = _searchData[key]
        }
        return obj
      }, {})
      //, { pageIndex, pageSize }

      http.postPromise('/userInfo/queryAllTeacherInfosByStudents', Object.assign({}, ___searchData, { pageIndex, pageSize })).then(data => {
        const dataList = (data.data.dataList || []).map(item => {
          if (item.teacherTag) {
            item.teacherTag = JSON.parse(item.teacherTag)
          }

          if (item.teachBrance) {
            item.teachBrance = JSON.parse(item.teachBrance)
            item.teachBranchSlave = item.teachBrance.map(item => item.teachBranchName).join(',')
          }

          return item
        })

        const list = pageIndex === 1 ? dataList : dataList ? [...teacherList, ...dataList] : teacherList

        //console.log(list.length, data.data.total)
        this.setData({
          teacherList: list,
          pageIndex,
          isEnd: !dataList || dataList.length < pageSize || list.length >= data.data.total,
          //pageCount: data.data ? 1000 : pageIndex
        })
        this.running = false
      }).catch(e => {
        this.running = false
        this.setData({
          teacherList: [],
          isEnd: true,
          //pageCount: data.data ? 1000 : pageIndex
        })
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchList()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onScrollToLower: function () {
    if (!this.data.isEnd) {
      this.fetchList(this.data.pageIndex + 1)
    }
  },
})