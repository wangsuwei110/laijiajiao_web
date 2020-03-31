// pages/Student/Mailbox/Mailbox.js

const util = require("../../../utils/util");
const http = require("../../../utils/api");

Page({
    /**
     * 页面的初始数据
     */
    data: {
        adviseDesc: ""
    },

    timer: 0,

    onDescChange(e) {
        this.setData({ adviseDesc: e.detail.value });
    },

    onSubmitClick: util.serverThrottle(function() {
        const { adviseDesc } = this.data;

        if (!adviseDesc) {
            return wx.showToast({
                title: "请填写内容",
                icon: "none"
            });
        }

        return http
            .postPromise("/studentAdvise/add", {
                content: adviseDesc,
                personId: wx.getStorageSync("user_id"),
                type: "1",
                name: wx.getStorageSync("user_name"),
                telephone: wx.getStorageSync("user_phone")
            })
            .then(data => {
                wx.showToast({
                    title: "提交成功",
                    icon: "none",
                    image: "",
                    duration: 1500,
                    mask: false,
                    success: result => {
                        this.timer = setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            });
                        }, 1500);
                    }
                });
                return util.PromiseEND;
            });
    }),

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        clearTimeout(this.timer);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearTimeout(this.timer);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
});
