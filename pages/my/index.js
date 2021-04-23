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
    userMobile:'',
    balanceMoney:0
  },
  onLoad() {
    var that = this;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if(userMobile==""){
      that.setData({
        showDialog: true
      });
    }else{
      that.setData({
        userMobile: userMobile
      })
    } 
  },
  onUnload(){
    
  },
  onShow() {
    let that = this;

    //初始化变量
    that.setData({
      studentList: [],
      isStudentListNull: false
    })
    that.queryBalance();
  },
  serviceTelephone: function() {
    wx.makePhoneCall({
      phoneNumber: '17805421508'
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
  //上课记录
  signDetail:function(e){
    var that = this;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if(userMobile==""){
      that.setData({
        showDialog: true
      });
    }else{
      that.setData({
        userMobile: userMobile
      })

      wx.navigateTo({
        url: "/pages/sign-detail/index"
      })
    } 
  },
   //缴费记录
   tuitionDetail:function(e){
    var that = this;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if(userMobile==""){
      that.setData({
        showDialog: true
      });
    }else{
      that.setData({
        userMobile: userMobile
      })

      wx.navigateTo({
        url: "/pages/tuition-detail/index"
      })
    } 
  },
   //查询余额
   queryBalance:function(e){
    var that = this;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    
    if(userMobile==""){
     
    }else{
      wx.request({
        header: {
          'content-Type': 'application/json'
        },
        dataType:'json',
        method: 'POST',
        url: 'https://lzqpp.natapp4.cc/weixin/queryBalanceByPhone/'+userMobile,
        success: function(res) {
          console.log(res.data);
          that.setData({
            balanceMoney: res.data
          })
        }
      }) 
    } 
  },
  //充值
  recharge:function(e){
    var that = this;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if(userMobile==""){
      that.setData({
        showDialog: true
      });
    }else{
      that.setData({
        userMobile: userMobile
      })

      wx.navigateTo({
        url: "/pages/recharge/index"
      })
    } 
  },
  //消息通知
  notifyAndMsg:function(){
    wx.showModal({
      title: '提示',
      content: '消息通知功能暂未开放！',
      showCancel: false
    })
  },
  //推广返课
  tuiguang:function(){
    wx.showModal({
      title: '提示',
      content: '推广返课功能暂未开放！',
      showCancel: false
    })
  },
  toggleDialog:function(e) {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
})