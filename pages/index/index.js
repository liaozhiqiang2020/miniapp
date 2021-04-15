//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    lunboImgs:[  
      
    ],
    newImgs:[
      
    ],
    showDialog: false,
    locationUrl:"https://lzqpp.natapp4.cc"
  },
  onload: function(options) {
    this.onShow();
  },
  onReady: function(e) {
    
  },
  onShow:function(e){
    var that = this;
    that.loadLunboImg();
    that.loadNewImg();
  },
  toggleDialog:function(e) {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  loginApp:function(e){
    var that = this;

    wx.getUserInfo({
      lang: "zh_CN",
      success: function (res) {
        var userInfo = res.userInfo;
        console.log(userInfo);
        wx.setStorageSync('userInfo', userInfo);
      }
    })

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
                    
                    console.log("小程序登陆成功");
                    wx.switchTab({
                      url: '../index/index?openid='+res.data.openid,
                      fail:function(){
                        console.info("跳转失败")
                      }
                    })
                  }else{
                    that.goLoginPageTimeOut(res.data.openid)
                    return
                  }
                }
              })

              wx.setStorageSync("sessionKey", res.data.sessionKey);
              // console.log(res.data.sessionKey);
              if (res.data.phoneNumber != null && res.data.phoneNumber != undefined && res.data.phoneNumber != '') {
                wx.setStorageSync("phoneNumber", res.data.phoneNumber);//手机号
              }
            }
          }
        });
        
      }
    });
  },
  goLoginPageTimeOut: function (openId) {
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/authorize/index?openId=" + openId
      })
    }, 500)
  },
  getPhoneNumber: function(e) { 
    var that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var code = wx.getStorageSync("code");
    var openid = wx.getStorageSync("openid");
    var sessionKey = wx.getStorageSync("sessionKey");
    var userInfo = wx.getStorageSync('userInfo')
    wx.request({
      url: 'https://lzqpp.natapp4.cc/weixin/getUserInfo',
      data: {
        sessionkey: sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        openid: openid,
        userInfos: userInfo
      },
      success: function(res) {
        if (res.data.phoneNumber != "") {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          });
          that.toggleDialog();
          wx.setStorageSync("phoneNumber",res.data.phoneNumber);
          //that.btnJLAction();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  loadLunboImg:function(e){
    var that = this;
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/findGongGaoNotice/4",
      method: 'POST',
      success: function(res) {
        that.setData({
          lunboImgs: res.data
        });
      }
    });     
  },
  loadNewImg:function(e){
    var that = this;
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/findGongGaoNotice/1",
      method: 'POST',
      success: function(res) {
        that.setData({
          newImgs: res.data
        });
      }
    });     
  },
  btnJLAction: function(e){
    var that = this;
    let userInfo = wx.getStorageSync('userInfo')
    let phone = wx.getStorageSync("phoneNumber"); //手机号
    if (!userInfo) {
      that.loginApp();
    }else{
      if(phone==""){
        that.setData({
          showDialog: true
        });
      }else{
        wx.request({
          url: "https://lzqpp.natapp4.cc/weixin/findExistCoach/"+phone,
          method: 'POST',
          success: function(res) {
            if(res.data.name!=null && res.data.name!=""){
              wx.redirectTo({
                url:"/pages/sign/index"
              })
            }else{
              wx.showModal({
                title: '提示',
                content: '您不是教练！',
                showCancel: false
              })
            }
          }
        });     
      }
    }
  },
  btnXKAction:function(){
    wx.redirectTo({
      url:"/pages/sign-up/index"
    })
  },
  btnXXAction:function(){
    wx.showModal({
      title: '提示',
      content: '课程表功能暂未开放！',
      showCancel: false
    })
  },
  btnQCAction:function(){
    var that = this;
    let userInfo = wx.getStorageSync('userInfo')
    let phone = wx.getStorageSync("phoneNumber"); //手机号
    if (!userInfo) {
      // wx.navigateTo({
      //   url: "/pages/authorize/index"
      // })
      that.loginApp();
    }else{
      if(phone==""){
        that.setData({
          showDialog: true
        });
      }else{
        wx.redirectTo({
          url:"/pages/commodity/index"
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: "零之启乒乓",
      path: 'pages/index/index'
    }
}
})