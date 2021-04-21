//app.js
App({
  onLaunch: function () {
    var that = this;

    //wx.clearStorage();

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
       if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
         wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
           if (res.confirm) {
            updateManager.applyUpdate()
           }
          }
         })
        })
        updateManager.onUpdateFailed(function () {
         wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
         })
        })
       }
      })
     } else {
      wx.showModal({
       title: '提示',
       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
     }

    // wx.getUserInfo({
    //   lang: "zh_CN",
    //   success: function (res) {
    //     var userInfo = res.userInfo;
    //     console.log(userInfo);
    //     wx.setStorageSync('userInfo', userInfo);
    //   }
    // })

    wx.login({
      success: function (res) {
        var service_url = 'https://lzqpp.natapp4.cc/weixin/';
        wx.setStorageSync("code", res.code);//将获取的code存到缓存中
        wx.request({
          url: service_url + 'login?code=' + res.code,
          data: {},
          method: 'GET',
          success: function (res) {
            if (res.data != null && res.data != undefined && res.data != '') {
              wx.setStorageSync("openid", res.data.openid);//将获取的openid存到缓存中(用户唯一id信息)

              wx.request({
                url: 'https://lzqpp.natapp4.cc/weixin/findWxUserInfoByOpenId/' + res.data.openid,
                method: 'POST',
                success: function (rest) {
                  if (rest.data != null && rest.data != undefined && rest.data != '') {
                      wx.setStorageSync("userInfo", rest.data);
                  }
                }
              })

              wx.setStorageSync("sessionKey", res.data.sessionKey);
              if (res.data.phoneNumber != null && res.data.phoneNumber != undefined && res.data.phoneNumber != '') {
                wx.setStorageSync("phoneNumber", res.data.phoneNumber);//手机号
              }
            }
          }
        });
        
      }
    });
  },
  // goLoginPageTimeOut: function (openId) {
  //   setTimeout(function () {
  //     wx.navigateTo({
  //       url: "/pages/authorize/index?openId=" + openId
  //     })
  //   }, 500)
  // }
})
