const app = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //获取到的手机栏中的值
    name: '',
    age: '',
    school: '',
    sex:'',
    shareImgs:[],
    locationUrl:"https://lzqpp.natapp4.cc"
  },
  onload: function(options) {
    this.onShow();
  },
  onReady: function(e) {
    
  },
  onShow:function(e){
    var that = this;
    that.loadShareImg();
  },
  handChange:function(e){
    let sex = e.detail.value;
    console.log(sex);
    this.setData({
        sex:sex
    })
  },
  handlePhone: function (e) {
    let value = e.detail.value.replace(/\D/g, '')
    this.setData({
      phone: value
    })
  },
  handleName: function (e) {
    console.log(e);
    this.setData({
      name: e.detail.value
    })
  },
  handleAge: function (e) {
    let value = e.detail.value.replace(/\D/g, '')
    console.log(e);
    this.setData({
      age: value
    })
  },
  handleSchool: function (e) {
    console.log(e);
    this.setData({
      school: e.detail.value
    })
 
  },
  submit: function (e) {
    var that = this;
    if(that.data.phone.trim()==""){
      wx.showModal({
        title: '提示',
        content: '请输入手机号！',
        showCancel: false
      })
      return
    }else if(that.data.name.trim()==""){
      wx.showModal({
        title: '提示',
        content: '请输入姓名！',
        showCancel: false
      })
      return
    }else if(that.data.sex==""){
      wx.showModal({
        title: '提示',
        content: '请选择性别！',
        showCancel: false
      })
      return
    }
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/addSignUp" ,
      method: "POST",
      data: {
        phone: that.data.phone,
        name: that.data.name,
        sex:that.data.sex,
        age:that.data.age,
        school:that.data.school
      },
      header: {
        'content-Type': 'application/json'
      },
      dataType:'json',
      success: function (res) {
        if(res.data==1){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            success: function () { //接口调用结束的回调函数 
              setTimeout(function() {
                //要延时执行的代码
                wx.switchTab({
                  url: '../index/index'    
                })
              }, 1500) //延迟时间  
            } 
          })
        }
      }
    })
  },
  loadShareImg:function(e){
    var that = this;
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/findGongGaoNotice/3",
      method: 'POST',
      success: function(res) {
        that.setData({
          shareImgs: res.data
        });
      }
    });     
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
        title: "零之启乒乓在线报名",
        path: 'pages/sign-up/index',
        imageUrl:that.data.locationUrl+that.data.shareImgs[0].imgUrl
      }
  }
})