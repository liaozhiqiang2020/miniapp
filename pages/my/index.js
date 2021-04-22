const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    studentList:[],
    isStudentListNull:false,
    showDialog: false,
    userInfo:{
      "avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      "nickName":"点击获取头像昵称"
    },
    userMobile:''
  },
  onLoad() {
    
  },
  onUnload(){
    
  },
  onShow:function onShow() {
    let that = this;

    //初始化变量
    that.setData({
      studentList: [],
      isStudentListNull: false
    })

    let userInfo = wx.getStorageSync("userInfo");
    if(userInfo && userInfo.avatarUrl!=null){
      that.setData({
        userInfo: userInfo
      })
    }

    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if(userMobile==""){
      that.setData({
        showDialog: true
      });
    }else{
      that.setData({
        userMobile: userMobile
      })
      that.bandStudent();
    } 
  },
  serviceTelephone: function() {
    wx.makePhoneCall({
      phoneNumber: '17805421508'
    })
  },
  getUserImg:function(e){
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo || userInfo.avatarUrl==null){
      wx.redirectTo({
        url:"/pages/authorize/index"
      })
    } 
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
    var openid = wx.getStorageSync("openid");
    var sessionKey = wx.getStorageSync("sessionKey");
    wx.request({
      url: 'https://lzqpp.natapp4.cc/weixin/getUserPhoneNumber',
      data: {
        encryptedData: e.detail.encryptedData,
        sessionkey: sessionKey,
        iv: e.detail.iv,
        openid: openid
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