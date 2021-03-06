//index.js
const util = require('../../utils/throttle.js')

const app = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    commodityList:[],
    hiddenmodalput: true, //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    comId:'',
    comCount:'',
    price:'',
    shareImgs:[],
    currentType: '',
    locationUrl:"https://lzqpp.natapp4.cc",
    goodsTypeList:[]
  },
  initData(currentPage) {
    //写你自己的接口
    this.onShow();
 
  },
  onload: function(options) {
    
  },
  statusTap: function(e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType;
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  onShow:function() {
    var that = this;
    that.selectCommoditys();
    that.loadShareImg();
    that.selectGoodsTypeList();
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
    var page = that.data.currentType;
    wx.request({
          url: "https://lzqpp.natapp4.cc/weixin/findAllStorages",
          method: 'POST',
          header: {
            'content-Type': 'application/json'
          },
          data:{
            "type":page+1
          },
          dataType:'json',
          success: function(res) {
            that.setData({
              commodityList: res.data
            })
          }
      });
  },
  selectGoodsTypeList:function(){
    var that = this;
    wx.request({
          url: "https://lzqpp.natapp4.cc/weixin/getDictType/goods_type",
          method: 'POST',
          success: function(res) {
            that.setData({
              goodsTypeList: res.data
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
  confirm: util.throttle(function(e) {
    var that = this;
    var comId = that.data.comId;//商品id
    var comCount = that.data.comCount;//数量
    var comPrice = that.data.price;//金额
    if(comCount!=""){
      var openid = wx.getStorageSync("openid");
      var i=Math.random()*(999999-100000)+100000;
      var timestamp = Date.parse(new Date());  
      timestamp = timestamp / 1000;
      var j=parseInt(i,10)+timestamp;
      var paidOrderId=comId+"_"+j;
      var money = comPrice*comCount;
      var service_url = 'https://lzqpp.natapp4.cc/weixin/';
      wx.request({
        url: service_url + 'wxPay?openid=' + openid + "&paidOrderId=" + paidOrderId + "&money=" + money,
        data: {},
        method: 'GET',
        success: function(res1) {
          that.doWxPay(res1.data, comId,comCount,j);
        },
        fail: function(res) {
          console.log("支付失败")
          console.log(error)
        }
      });  
    }
  },5000),
  doWxPay:function(param, comId,comCount,j) {
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
          that.outStorage(comId,comCount,j);
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
  outStorage:function(comId,comCount,j){
    var that = this;
    var tel = wx.getStorageSync("phoneNumber");
    wx.request({
      url: "https://lzqpp.natapp4.cc/weixin/outStorage/"+comId+"/"+comCount+"/"+tel+"/"+j,
      method: 'POST',
      success: function(res) {
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
        title: "零之启在线商城",
        path: 'pages/commodity/index',
        imageUrl:that.data.locationUrl+that.data.shareImgs[0].imgUrl
      }
  }
})