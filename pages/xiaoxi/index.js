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
    currentType: 2,
    locationUrl:"https://lzqpp.natapp4.cc",
    goodsTypeList:[
      {
        "id":"2",
        "name":"消息"
      },
      {
        "id":"0",
        "name":"通知"
      }
  ]
  },
  initData(currentPage) {
    //写你自己的接口
    this.onShow();
 
  },
  onload: function(options) {
    
  },
  statusTap: function(e) {
    var curType = e.currentTarget.dataset.index;
    console.log(curType);
    this.data.currentType = curType;
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  onShow:function() {
    var that = this;
    that.selectCommoditys();
  },
  selectCommoditys:function(){
    var that = this;
    var page = that.data.currentType;
    let userMobile = wx.getStorageSync("phoneNumber"); //手机号
    if(page==0){
      wx.request({
        url: "https://lzqpp.natapp4.cc/weixin/findGongGaoNotice/"+page,
        method: 'POST',
        success: function(res) {
          that.setData({
            commodityList: res.data
          })
        }
      });
    }else{
      wx.request({
        url: "https://lzqpp.natapp4.cc/weixin/findXiaoxiListByTypeAndTel/"+page+"/"+userMobile,
        method: 'POST',
        success: function(res) {
          that.setData({
            commodityList: res.data
          })
        }
      });
    }
  },
  xiaoxiDetail:function(e){
    var noticeInfo = JSON.stringify(e.currentTarget.dataset.value);
    wx.navigateTo({
      url:"/pages/xiaoxi-detail/index?noticeInfo="+noticeInfo
    })  
  }
})