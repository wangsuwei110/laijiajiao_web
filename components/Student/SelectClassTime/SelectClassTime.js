// components/Student/SelectClassTime/SelectClassTime.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        weekData: {
            type: Array,
            value: [],
            observer(weekData) {
                const _weekData = {};
                weekData.map((item) => {
                    _weekData[item.week] = _weekData[item.week] || {};
                    _weekData[item.week][item.time] = true;
                });

                this.setData({ _weekData });
            },
        },
        teachTime: {
            type: Object,
            value: {},
        },
        useTeach: {
            type: Boolean,
            value: false,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        _weekData: {},
        week: Array.from({ length: 7 }).map((item, index) => index + 1),
        dataList: [
            {
                id: 0,
                name: "上午",
                time: "（08:00-12:00）",
            },
            {
                id: 1,
                name: "下午",
                time: "（12:00-18:00）",
            },
            {
                id: 2,
                name: "晚上",
                time: "（18:00-23:00）",
            },
        ],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onDataChange(_weekData) {
            const weekList = Object.keys(_weekData).reduce((list, week) => {
                return [...list, ...Object.keys(_weekData[week]).map((time) => ({ week: Number(week), time: Number(time) }))];
            }, []);
            //console.log(weekList)
            this.triggerEvent("onChange", weekList);

            this.setData({ _weekData });
        },

        onWeekChange(e) {
            const { _weekData, teachTime, useTeach } = this.data;
            const week = Number(e.currentTarget.dataset.week);
            const time = Number(e.currentTarget.dataset.time);
            //console.log(teachTime);
            if (_weekData[week] && _weekData[week][time]) {
                delete _weekData[week][time];
                this.onDataChange(_weekData);
            } else {
                const teahTimeList = teachTime[week] || [];
                const data = _weekData[week] || {};
                if (useTeach && typeof teahTimeList.find((item) => item === time) !== "number") {
                    wx.showModal({
                        title: "提示",
                        content: "您的上课时间不在该教员的授课时间范围内，请谨慎选择",
                        showCancel: true,
                        cancelText: "取消",
                        cancelColor: "#000000",
                        confirmText: "确定",
                        confirmColor: "#3CC51F",
                        success: (result) => {
                            if (result.confirm) {
                                data[time] = true;
                                _weekData[week] = data;
                                this.onDataChange(_weekData);
                            }
                        },
                        fail: () => {},
                        complete: () => {},
                    });
                } else {
                    data[time] = true;
                    _weekData[week] = data;
                    this.onDataChange(_weekData);
                }
            }
        },
    },
});
