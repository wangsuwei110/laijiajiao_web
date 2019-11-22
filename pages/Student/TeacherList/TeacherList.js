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
  },

  running: false,

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
      http.postPromise('/teacher/list', Object.assign({}, searchData, { pageIndex, pageSize })).then(data => {
        this.setData({
          teacherList: pageIndex === 1 ? data.data : data.data ? [...teacherList, ...data.data] : teacherList,
          pageIndex,
          isEnd: !data.data || data.data.length < pageSize,
          //pageCount: data.data ? 1000 : pageIndex
        })
        this.running = false
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
    this.fetchList(this.data.pageIndex + 1)
  },
})