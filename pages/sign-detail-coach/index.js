const app = getApp()

Page({
  data: {
    signList:[],
    mobilePhone:'',
    winHeight:900
  },
  onLoad(option) {
    var that = this;
    let mobilePhone = wx.getStorageSync("phoneNumber"); //手机号

    that.setData({
      mobilePhone:mobilePhone
    })
  },
  onShow() {
    this.bandStudent();
  },
  onReady() {
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
  bandStudent:function(){
    var that = this;
    var mobilePhone = that.data.mobilePhone;
    wx.request({
      header: {
        'content-Type': 'application/json'
      },
      dataType:'json',
      method: 'POST',
      url: 'https://lzqpp.natapp4.cc/weixin/coachFindSignDetails/'+mobilePhone,
      success: function(res) {
        that.setData({
          signList: res.data
        })
      }
    })
  }
})