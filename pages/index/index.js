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
          that.btnJLAction();
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
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
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
    wx.showModal({
      title: '提示',
      content: '在线报名功能暂未开放！',
      showCancel: false
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
    wx.showModal({
      title: '提示',
      content: '器材购买功能暂未开放！',
      showCancel: false
    })
  },
})