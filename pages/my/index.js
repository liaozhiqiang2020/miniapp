const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    studentList:[]
  },
  onLoad() {

  },
  onShow() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    } else {  
      that.setData({
        userInfo: userInfo,
        userMobile: userMobile
      })
      that.bandStudent();
    }
  },
  serviceTelephone: function() {
    wx.makePhoneCall({
      phoneNumber: '4000600917'
    })
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
      url: 'http://localhost:8080/weixin/getUserInfo',
      data: {
        sessionkey: sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        openid: openid,
        userInfos: userInfo
      },
      success: function(res) {
        // console.log(res);
        if (res.data.phoneNumber != "") {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          });
          that.setData({
            userMobile: res.data.phoneNumber
          })

          // that.getUserApiInfo();
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
  bandStudent:function(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/weixin/findStudentByPhone/'+that.data.userMobile,
      success: function(res) {
        console.log(res.data);
        that.setData({
          studentList: res.data
        })
      }
    })
  },
  signDetail:function(e){
    var that = this;
    wx.navigateTo({
      url: "/pages/sign-detail/index?studentId="+e.currentTarget.dataset.pid
    })
  },
  recharge:function(e){
    var that = this;
    wx.navigateTo({
      url: "/pages/recharge/index?studentId="+e.currentTarget.dataset.pid
    })
  }

})