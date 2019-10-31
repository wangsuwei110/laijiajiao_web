// pages/Student/OrderList/OrderList.js

const http = require('../../../utils/api')

/* 订单列表的返回参数：
@ApiModelProperty(value = "需求主键id")
private Integer sid;

@ApiModelProperty(value = "学员ID")
private Long studentId;

@ApiModelProperty(value = "学员姓名")
private String studentName;

@ApiModelProperty(value = "上课地址")
private String demandAddress;

@ApiModelProperty(value = "补习年级")
private Integer demandGrade;

@ApiModelProperty(value = "辅导科目id")
private Integer subjectId;

@ApiModelProperty(value = "年级和科目")
private String gradeSubject;

@ApiModelProperty(value = "付费订单开始时间")
private Date orderStart;

@ApiModelProperty(value = "订单周数")
private Date weekNum;

@ApiModelProperty(value = "每周上课次数")
private Long classNum;

@ApiModelProperty(value = "每周上课时间范围")
private String timeRange;

@ApiModelProperty(value = "订单类型,1:试讲订单,2:付费订单")
private Integer orderType;

@ApiModelProperty(value = "订单金额")
private Float orderMoney;

@ApiModelProperty(value = "具体需求")
private String demandDesc;

@ApiModelProperty(value = "状态 0:未发布，1:发布中;2:已接单;3:结单")
private Boolean status;

@ApiModelProperty(value = "创建时间")
private Date createTime;

@ApiModelProperty(value = "创建人")
private String createUser;

@ApiModelProperty(value = "修改时间")
private Date updateTime;

@ApiModelProperty(value = "修改人")
private String updateUser;

@ApiModelProperty(value = "预约试讲时间")
private Date orderTeachTime;

@ApiModelProperty(value = "预约试讲教员的数量")
private Integer orderTeachCount;

@ApiModelProperty(value = "预约教员的姓名")
private String teachName;

@ApiModelProperty(value = "预约教员通过的评价")
private String appraise;

@ApiModelProperty(value = "试讲状态:0:未试讲，1:试讲中;2:试讲通过;3:试讲未通过")
private Integer subscribeStatus; */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    isEnd: false,
    loaded: false,
    pageSize: 20,
  },

  pageIndex: 1,

  fetchOrderList(pageIndex = 1) {
    const { orderList, isEnd, pageSize } = this.data

    isEnd || http.postPromise('/StudentDemand/demandList', { pageIndex, pageSize, parentPhoneNum: wx.getStorageSync('user_phone') }).then(data => {
      this.pageIndex = pageIndex
      this.setData({ loaded: true, isEnd: !data.data || data.data.length < pageSize, orderList: pageIndex === 1 ? data.data : [...orderList, ...data.data] })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fetchOrderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchOrderList(this.pageIndex + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})