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
      subjectId: 0,
      addressId: 0,
      schoolId: 0,
      type: null,
      sex: 0,
    },
    teacherList: []
  },


  onChange(e) {
    const { searchData } = this.data
    this.setData({ searchData: Object.assign({}, searchData, e.detail) }, () => this.fetchList())
  },

  onCancel (){
    this.selectComponent('teacherFilter').onCancel()
  },

  fetchList(pageIndex = 1) {
    const { searchData } = this.data
    http.postPromise('/teacher/list', Object.assign({}, searchData, { pageIndex })).then(data => {
      
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchList()
  },

})