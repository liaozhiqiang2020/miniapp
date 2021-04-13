var wxpay = require('../../utils/pay.js')
var time = require('../../utils/util2.js');
var app = getApp()
Page({
  data: {
    isNoMoreData: false,
    winHeight: 900,
    nodataType: 7,   
    currentPage: 1,
    statusType: ["周一", "周二", "周三", "周四","周五", "周六", "周日"],
    currentType: 0,
    tabClass: ["", "", "", "","", "", ""],
    orderList:[]
  },
  onLoad: function (options) { 
    //this.initData(1);    //获取数据的方法
  },
  initData(currentPage) {
   
    //写你自己的接口
    this.onShow();
 
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight*2.34
        })
      },
    })
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  },
  onReachBottom: function () {    //上拉加载分页
    this.setData({
      loading:true
    })
    console.log(222);
    if (!this.data.isNoMoreData&&this.data.orderList.length>0) {
      console.log(111);
      this.initData(++this.data.currentPage);
    }
  },
  statusTap: function(e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType;
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  onShow: function() { //tab页加载
    wx.showLoading();
    var that = this;
    var page = that.data.currentType;
    var url = "http://localhost:8080/weixin/findCoachAndClass";

    var data;
    var openid = wx.getStorageSync("openid");
    if (page == 1) { //周一
      data = {
        openCode: openid,
        state: '周二'
      }
    } else if (page == 2) { //周二
      data = {
        openCode: openid,
        state: '周三'
      }
    } else if (page == 3) { //周三
      data = {
        openCode: openid,
        state: '周四'
      }
    } else if (page == 4) { //周四
      data = {
        openCode: openid,
        state: '周五'
      }
    }else if (page == 5) { //周五
      data = {
        openCode: openid,
        state: '周六'
      }
    }else if (page == 6) { //周六
      data = {
        openCode: openid,
        state: '周日'
      }
    }else if (page == 0) { //周日
      data = {
        openCode: openid,
        state: '周一'
      }
    }

    wx.request({
      url: url+"/"+data.state,
      method: 'POST',
      success: (res) => {
        wx.hideLoading();
        if (res.data != "") { //如果有数据就显示
          for (var i = 0; i < res.data.length; i++) {
            that.setData({
              orderList: res.data
            });
          }
        } else { //没有数据不显示
          that.setData({
            orderList: ""
          });
        }
      }
    })

  },

})