const app = getApp()

Page({
  data: {
    signList:[],
    stduentId:0
  },
  onLoad(option) {
    this.setData({
      stduentId: option.studentId
    })
  },
  onShow() {
  },
  bandStudent:function(){
    
  },
  recharge: function(e) {
    var that=this;

    var mon = e.currentTarget.dataset.value;
    const pages = getCurrentPages();
    var studentId = pages[1].options.studentId;
    //var studentId = that.data.studentId;
    if (studentId != undefined) {
      var openid = wx.getStorageSync("openid");
      var i=Math.random()*(999999-100000)+100000;
      var j=parseInt(i,10);
      var paidOrderId=studentId+"_"+j;
      var money = mon;
      var service_url = 'http://localhost:8080/weixin/';
      wx.request({
        url: service_url + 'wxPay?openid=' + openid + "&paidOrderId=" + paidOrderId + "&money=" + money,
        data: {},
        method: 'GET',
        success: function(res1) {
          console.log(studentId);
          that.doWxPay(res1.data, studentId,money);
        },
        fail: function(res) {
          console.log("支付失败")
          console.log(error)
        }
      });
    }
  },
  doWxPay:function(param, studentId,money) {
    console.log(studentId);
    var that = this;
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.data.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.data.nonceStr,
      package: param.data.package,
      signType: 'MD5',
      paySign: param.data.paySign,
      success: function(res) {
        // success   
        console.log(res);
        



        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        //   duration: 2000
        // });

        if (res.errMsg == "requestPayment:ok") { // 调用支付成功
          that.addTuition(studentId,money);
          wx.showModal({
            title: '感谢使用',
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
  addTuition:function(studentId,money){
    var that = this;
    wx.request({
      header: {
        'content-Type': 'application/json'
      },
      dataType:'json',
      method: 'POST',
      url: 'http://localhost:8080/weixin/addTuition/'+studentId+"/"+money,
      success: function(res) {
        if(res.data==0){
          
        }else if(res.data==1){
          wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
        }

        wx.switchTab({
          url: "/pages/my/index",
          success(res2){
                let page = getCurrentPages().pop();
                if(page == undefined || page == null){
                      return
                }
                page.onLoad();
          }
    })
      }
    })
  }
})