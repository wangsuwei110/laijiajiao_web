var http = require("../../../utils/api.js");
Page({
    data: {
        isIPX: getApp().isIPX,
        propose: ""
    },
    getContent: function(e) {
        this.setData({
            propose: e.detail.value
        });
    },
    submitPropose: function() {
        var that = this;
        if (that.data.propose.trim() === "") {
            wx.showToast({
                title: "请输入内容",
                icon: "none"
            });
            return;
        }
        var params = {
            content: that.data.propose,
            personId: wx.getStorageSync("user_id"),
            type: "1",
            name: wx.getStorageSync("user_name"),
            telephone: wx.getStorageSync("user_phone")
        };
        wx.showLoading({
            title: "提交中..."
        });
        http.post(
            "/ComplaintSuggestion/addComplaintSuggestion",
            params,
            function(res) {
                wx.showToast({
                    title: "提交成功",
                    icon: "success"
                });
                that.setData({
                    propose: ""
                });
            },
            function(err) {
                wx.showToast({
                    title: err.msg,
                    icon: "none"
                });
            },
            function() {
                wx.hideLoading();
            }
        );
    }
});
