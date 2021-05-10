//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    lunboImgs:[],
    newImgs:[],
    shareImgs:[],
    showDialog: false,
    locationUrl:"https://lzqpp.natapp4.cc",
    winHeight:1334,
    btnMenu:[],
    userMobile:"",
    size:"25%"
  },
  onload: function(options) {
    
  },
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: (res.windowHeight*2.34)/2+125
        })
      },
    })
  },
  onShow:function(e){
    var that = this;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    console.log(userMobile);
    if(userMobile==""){
      that.setData({
        showDialog: true
      });
    }else{
      that.setData({
        userMobile: userMobile
      })
      that.loadLunboImg();
      that.loadNewImg();
      // that.loadShareImg();
      that.loadBtnMenu();
    } 
    
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
          that.onShow();
          wx.setStorageSync("phoneNumber",res.data.phoneNumber);
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
  loadBtnMenu:function(e){
    var that = this;
    var mobile = that.data.userMobile;
    // var mobile = "123548546";
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/findAllBtnMenuByTel/"+mobile,
      method: 'POST',
      success: function(res) {
        
        that.setData({
          btnMenu: res.data,
          size:Math.floor(100/res.data.length)
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
  // loadShareImg:function(e){
  //   var that = this;
  //   wx.request({
  //     url: "https://lzqpp.natapp4.cc/weixin/findGongGaoNotice/3",
  //     method: 'POST',
  //     success: function(res) {
  //       that.setData({
  //         shareImgs: res.data
  //       });
  //     }
  //   });     
  // },
  btnJLAction: function(e){
    var that = this;
    let phone = wx.getStorageSync("phoneNumber"); //手机号
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
            wx.navigateTo({
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
  },
  btnXKAction:function(e){
    var src = e.currentTarget.dataset.src;
    var name = e.currentTarget.dataset.name;
    if(src==""){
      wx.showModal({
        title: '提示',
        content: name+'功能暂未开放！',
        showCancel: false
      })
    }else{
      wx.navigateTo({
        url:src
      })
    }
   
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
    let phone = wx.getStorageSync("phoneNumber"); //手机号
    if(phone==""){
      that.setData({
        showDialog: true
      });
    }else{
      wx.navigateTo({
        url:"/pages/commodity/index"
      })
    }
  },
  noticeDetail:function(e){
      var noticeInfo = JSON.stringify(e.currentTarget.dataset.value);
      wx.navigateTo({
        url:"/pages/notice-detail/index?noticeInfo="+noticeInfo
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: "零之启乒乓",
      path: 'pages/index/index',
      imageUrl:that.data.locationUrl+that.data.shareImgs[0].imgUrl
    }
}
})