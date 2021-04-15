const app = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    commodityList:[],
    locationUrl:"https://lzqpp.natapp4.cc",
    hiddenmodalput: true, //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    comId:'',
    comCount:'',
    price:''
  },
  onload: function(options) {
    
  },
  onShow() {
    var that = this;
    that.selectCommoditys();
  },
  goumai: function(e) { 
    var that=this;
    var comId = e.currentTarget.dataset.value;

    that.setData({
      hiddenmodalput:false,
      comId:comId,
      price:e.currentTarget.dataset.money
    })
  },
  selectCommoditys:function(){
    var that = this;
    wx.request({
          url: "https://lzqpp.natapp4.cc/weixin/findAllStorages",
          method: 'POST',
          header: {
            'content-Type': 'application/json'
          },
          data:{},
          dataType:'json',
          success: function(res) {
            console.log(res.data);
            that.setData({
              commodityList: res.data
            })
          }
      });
  },
  //取消按钮
  cancel: function(e) {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  发起支付
  confirm: function(e) {
    var that = this;
    var comId = that.data.comId;//商品id
    var comCount = that.data.comCount;//数量
    var comPrice = that.data.price;//金额
    if(comCount!=""){
      var openid = wx.getStorageSync("openid");
      var i=Math.random()*(999999-100000)+100000;
      var j=parseInt(i,10);
      var paidOrderId=comId+"_"+j;
      var money = comPrice*comCount;
      var service_url = 'https://lzqpp.natapp4.cc/weixin/';
      wx.request({
        url: service_url + 'wxPay?openid=' + openid + "&paidOrderId=" + paidOrderId + "&money=" + money,
        data: {},
        method: 'GET',
        success: function(res1) {
          console.log(comId);
          that.doWxPay(res1.data, comId,comCount);
        },
        fail: function(res) {
          console.log("支付失败")
          console.log(error)
        }
      });
      
    }
  },
  doWxPay:function(param, comId,comCount) {
    var that = this;
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      success: function(res) {
        if (res.errMsg == "requestPayment:ok") { // 调用支付成功
          that.outStorage(comId,comCount);
          wx.showModal({
            title: '购买成功',
            content: '成功',
            showCancel: false
          })
        } else if (res.errMsg == 'requestPayment:cancel') {　　　　　　 // 用户取消支付的操作
          
        }
      },
      fail: function(error) {
        // fail   
        console.log("支付失败")
        console.log(error)
      },
      complete: function() {
        // complete   
        console.log("pay complete")
      }
    });
  },
  //出库
  outStorage:function(comId,comCount){
    var that = this;
    var tel = wx.getStorageSync("phoneNumber");
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/outStorage/"+comId+"/"+comCount+"/"+tel,
      method: 'POST',
      success: function(res) {
        console.log(res.data); 
        that.setData({
          hiddenmodalput: true
        });
        that.onShow();
      }
  });
  },
  bindinput: function(e) {
    this.setData({
      comCount: e.detail.value
    });
  },
  submit: function (e) {
    var that = this;
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: "零之启在线报名",
        path: 'pages/sign-up/index'
      }
  }
})