const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    studentList:[],
    isStudentListNull:false,
    showDialog: false
  },
  onLoad() {
    
  },
  onShow() {
    let that = this;

    //初始化变量
    that.setData({
      studentList: [],
      isStudentListNull: false
    })

    let userInfo = wx.getStorageSync('userInfo')
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号

    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    } else { 
      if(userMobile==""){
        that.setData({
          showDialog: true
        });
      }else{
        that.setData({
          userInfo: userInfo,
          userMobile: userMobile
        })
        that.bandStudent();
      } 
    }
  },
  serviceTelephone: function() {
    wx.makePhoneCall({
      phoneNumber: '17805421508'
    })
  },
  bandStudent:function(){
    var that = this;
    wx.request({
      url: 'https://lzqpp.natapp4.cc/weixin/findStudentByPhone/'+that.data.userMobile,
      success: function(res) {
        if(res.data.length>0){
          that.setData({
            studentList: res.data
          })
        }else{
          that.setData({
            isStudentListNull: true
          })         
        }     
      }
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
          that.onShow();
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
  signDetail:function(e){
    wx.navigateTo({
      url: "/pages/sign-detail/index?studentId="+e.currentTarget.dataset.pid
    })
  },
  recharge:function(e){
    wx.navigateTo({
      url: "/pages/recharge/index?studentId="+e.currentTarget.dataset.pid
    })
  },
  toggleDialog:function(e) {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
})