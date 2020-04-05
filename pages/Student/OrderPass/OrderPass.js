// pages/Student/OrderPass/OrderPass.js
const http = require("../../../utils/api");
var appInst = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        item: {},
        price: 0,
        timeRange: [],
        weekNum: 1,
        teachTime: {},
        useTeach: true,
    },

    onWeekChange(e) {
        //console.log(e.detail);
        this.setData({ timeRange: e.detail });
    },

    onWeekNumChange(e) {
        //console.log(e)
        this.setData({ weekNum: e.detail });
    },

    onPay() {
        const { item, timeRange, weekNum, price } = this.data;
        let res = "";
        if (!timeRange.length) {
            res = "请选择上课时间";
        } else if (!weekNum) {
            res = "请输入购买周数";
        }

        if (res) {
            return wx.showToast({
                title: res,
                icon: "none",
            });
        }

        wx.login({
            success: (result) => {
                if (result.code) {
                    wx.showLoading();
                    const orderMoney = price * timeRange.length * weekNum;
                    const _timeRange = JSON.stringify(timeRange);

                    wx.requestSubscribeMessage({
                        tmplIds: ["3x11joEYp8Gk7Jl_kEFjLFZ0gg1U7FwFGencGDW_hXY"],
                    });

                    http.postPromise("/weixin/prepay", {
                        code: result.code,
                        orderMoney,
                        teacherId: item.teacherId,
                        demandId: item.sid,
                        timeRange: _timeRange,
                        isResumption: this.passed ? 1 : 0,
                        weekNum,
                        chargesStandard: price,
                    })
                        .then((data) => {
                            //this.triggerEvent('onSubmit')
                            //console.log(data.data.data)
                            wx.requestPayment(
                                Object.assign(
                                    {
                                        signType: "MD5",
                                        success: (res) => {
                                            wx.showModal({
                                                title: "提示",
                                                content: "支付成功",
                                                showCancel: false,
                                                cancelText: "取消",
                                                cancelColor: "#000000",
                                                confirmText: "确定",
                                                confirmColor: "#3CC51F",
                                                success: (result) => {
                                                    if (result.confirm) {
                                                        wx.navigateBack({
                                                            delta: this.from === 2 ? 2 : 1,
                                                        });
                                                        /* wx.login({
                        success: (res) => {
                          if (res.code) {
                            http.postPromise('/weixin/wxNotify', {
                              code: res.code,
                              orderMoney,
                              demandId: item.sid, timeRange:_timeRange,
                              weekNum
                            }).then(data => {
                              
                            })
                          }
                        }
                      }) */
                                                    }
                                                },
                                            });
                                        },
                                        fail: (res) => {
                                            //console.log(res)
                                            wx.showModal({
                                                title: "提示",
                                                content: "支付失败",
                                                showCancel: true,
                                                cancelText: "取消",
                                                cancelColor: "#000000",
                                                confirmText: "重新支付",
                                                confirmColor: "#3CC51F",
                                                success: (result) => {
                                                    if (result.confirm) {
                                                        this.onPay();
                                                    }
                                                },
                                                fail: () => {},
                                                complete: () => {},
                                            });
                                        },
                                    },
                                    data.data.data
                                )
                            );

                            wx.hideLoading();
                        })
                        .catch((e) => {
                            //console.log(e, 'error')
                            wx.hideLoading();
                        });
                } else {
                    wx.showToast({
                        title: result.errMsg,
                    });
                }
            },
            fail: () => {},
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const teacherId = appInst.globalData.orderItem.teacherId;
        this.passed = options.passed ? true : false;
        if (teacherId) {
            if (this.passed) {
                http.postPromise("/StudentDemand/continuePay", { sid: options.id }).then((res) => {
                    this.setData({
                        price: res.data,
                    });
                });
            } else {
                http.getPromise("/teacher/queryTeacherInfo", {
                    teacherId,
                }).then((data) => {
                    this.setData({ price: data.data.unitPrice });
                });
            }

            http.postPromise("/userInfo/queryUserInfosDetail", {
                teacherId,
                //studentId: sid
            }).then((data) => {
                //console.log(data.data.teachTime)
                const useTeach = !!data.data.teachTime;
                const teachTime = (useTeach ? JSON.parse(data.data.teachTime) : []).reduce((obj, item) => {
                    ////`${item.time}`.split(',').map(item => Number(item) + 1)
                    const arr = `${item.time}`.split(",").map((item) => Number(item));
                    //console.log(Set)
                    obj[item.week] = [...new Set([...(obj[item.week] || []), ...arr])];
                    return obj;
                }, {});

                //console.log(teachTime)

                this.setData({ teachTime, useTeach });
            });
        }

        http.getPromise("/StudentDemand/queryStudentDemandDetail", {
            demandId: appInst.globalData.orderItem.sid,
        }).then((data) => {
            this.setData({ timeRange: JSON.parse(data.data.timeRange) });
        });

        this.setData({ item: appInst.globalData.orderItem });

        appInst.globalData.orderItem = null;

        this.from = Number(options.from || 0);
        this.demandId = options.id;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
});
