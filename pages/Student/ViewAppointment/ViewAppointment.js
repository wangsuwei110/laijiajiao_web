// pages/Student/ViewAppointment/ViewAppointment.js
const http = require("../../../utils/api");
const weekCNList = ["一", "二", "三", "四", "五", "六", "日"];
const timeCNList = ["上午", "下午", "晚上"];
const hours = [
    [8, 9, 10, 12],
    [12, 13, 14, 15, 16, 17, 18],
    [18, 19, 20, 21, 22, 23],
];

const hoursCNList = hours.map((list) => list.map((item) => `${item}:00`));

var appInst = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        item: {},
        selectId: 0,
        teacherList: [],
        orderTime: [],
        weekList: [],
        timeList: [],
        weekTimeList: [],
        hoursList: [],
        teacher: null,
        RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    },

    weekIndex: 0,

    onGoPay() {
        const { item, teacher } = this.data;
        item.teacherId = teacher.teacherId;
        item.teachName = teacher.name;
        appInst.globalData.orderItem = item;
        wx.navigateTo({
            url: "/pages/Student/OrderPass/OrderPass?from=2",
        });
    },

    onShowModal() {
        wx.showModal({
            title: "提示",
            content: "请先选择教员",
            showCancel: false,
            confirmText: "确定",
            confirmColor: "#3CC51F",
        });
    },

    onSelectChange(e) {
        const { teacherList } = this.data;
        const selectId = Number(e.currentTarget.dataset.id);
        const teacher = teacherList.find((item) => item.teacherId === selectId);
        
        if (teacher) {
            if (teacher.status === 3) {
                wx.showModal({
                    title: "提示",
                    content: "当前教员试讲未通过无法选择",
                    showCancel: false,
                    confirmText: "确定",
                    confirmColor: "#3CC51F",
                });
            } else {
                this.setData({ selectId, teacher });
            }
        }
    },

    onDateChang(e) {
        const { timeList, selectId } = this.data;

        const item = timeList[e.detail.value[0]][e.detail.value[1]];

        const _hours = hours[item.time][e.detail.value[2]];

        const confirmDate = `${item.date.split("T")[0]} ${_hours < 10 ? "0" : ""}${_hours}:00:00`;

        http.postPromise("/StudentDemand/confirmTeacher", {
            teacherId: selectId,
            confirmDate,
            demandId: this.demandId,
            demandType: 2,
        }).then((data) => {
            wx.showModal({
                title: "提示",
                content: "预约成功",
                showCancel: false,
                confirmText: "确定",
                confirmColor: "#3CC51F",
                success: (result) => {
                    wx.navigateBack({
                        delta: 1,
                    });
                },
                fail: () => {},
                complete: () => {},
            });
        });
    },

    onColumnChange(e) {
        //console.log(e.detail)
        const { timeList } = this.data;
        const index = Number(e.detail.value);

        if (e.detail.column === 0) {
            this.weekIndex = index;
            const weekTimeList = timeList[index].map((item) => item.cn);
            const time = timeList[index][0].time;
            this.setData({ weekTimeList, hoursList: hoursCNList[time] });
        } else if (e.detail.column === 1) {
            const time = timeList[this.weekIndex][index].time;
            this.setData({ hoursList: hoursCNList[time] });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.demandId = options.id;
        this.setData({ item: appInst.globalData.orderItem });
        appInst.globalData.orderItem = null;

        /* http.getPromise('/StudentDemand/queryStudentDemandDetail', { demandId: options.id }).then(data => {
            
        }) */

        http.postPromise("/StudentDemand/listTeacher", { demandId: options.id }).then((data) => {
            const weekList = [
                ...new Set(
                    data.data.orderTime.map((item) => {
                        item.cn = timeCNList[item.time];
                        return item.weekDay;
                    })
                ),
            ];
            const timeList = weekList.map((key) => data.data.orderTime.filter((item) => item.weekDay === key));
            //console.log(weekList, timeList)

            this.setData({
                weekList: weekList.map((item) => {
                    const week = data.data.orderTime.find((w) => w.weekDay === item);
                    return `${week ? week.date.split("T")[0] : ""}星期${weekCNList[item - 1]}`;
                }),
                weekTimeList: timeList[0] ? timeList[0].map((item) => item.cn) : [],
                hoursList: timeList[0] ? hoursCNList[timeList[0][0].time] : []  ,
                timeList,
                orderTime: data.data.orderTime,
                teacherList: data.data.teacherList,
                //selectId: data.data.teacherList.length ? data.data.teacherList[0].teacherId : 0
            });
        });
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
