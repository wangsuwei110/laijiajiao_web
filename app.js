const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
const http = require("./utils/api");

App({
  globalData: {
    weekData: null
  },

  onShow() {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        }
      });
    }
  },

  onLaunch: function(options) {
    //console.log("[onLaunch] 本次场景值:", options.scene)
    // 获取手机信息

    let sysModel = wx.getSystemInfoSync().model;
    if (sysModel.indexOf("iPhone X") != -1) {
      this.isIPX = true;
    }

    /* wx.getSetting({
      success(res){
        console.log(res,res.authSetting,'test')
      }
    }) */

    wx.login({
      success: result => {
        http
          .postPromise("/user/getUserIdentity", { code: result.code })
          .then(res => {
            if (res.data.userId) {
              wx.setStorageSync("user_id", res.data.userId);
              wx.setStorageSync("user_name", res.data.userName);
              wx.setStorageSync("user_phone", res.data.phone);
              wx.setStorageSync("user_type", res.data.type);
              if (!res.data.userName) {
                wx.redirectTo({
                  url:
                    res.data.type === 1
                      ? "/pages/Student/LoginInfo/LoginInfo"
                      : "/pages/editUserinfo/editUserinfo"
                });
              } else {
                if (res.data.type === 1) {
                  wx.reLaunch({
                    url: "/pages/Student/index/index"
                  });
                } else {
                  wx.switchTab({
                    url: "/pages/home/index/index"
                  });
                }
              }
            } else {
              wx.removeStorageSync("user_id");
              wx.removeStorageSync("user_name");
              wx.removeStorageSync("user_phone");
              wx.removeStorageSync("user_type");
            }
          })
          .catch(e => {
            wx.removeStorageSync("user_id");
            wx.removeStorageSync("user_name");
            wx.removeStorageSync("user_phone");
            wx.removeStorageSync("user_type");
          });
      }
    });

    /* var token = wx.getStorageSync('token')
    var userName = wx.getStorageSync('user_name')
    var userType = wx.getStorageSync('user_type') || 1
    if (token) {
      if (userName == null || userName == '') {
        wx.reLaunch({
          url: userType === 1 ? '/pages/Student/LoginInfo/LoginInfo' : '/pages/editUserinfo/editUserinfo',
        })
      } else {
        if (userType === 1) {
          wx.reLaunch({
            url: '/pages/Student/index/index',
          })
        } else {
          wx.switchTab({
            url: '/pages/home/index/index',
          })
        }
      }
    } else {
      
    } */
    // wx.reLaunch({
    //   url: '/pages/discount/index'
    // })
  },
  isIPX: false
});
