const app = getApp()

Page({
  data: {
    signList:[],
    stduentId:0,
    winHeight:900
  },
  onLoad(option) {
    var that = this;
    that.setData({
      stduentId: option.studentId
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
        console.log(res.windowHeight*2.34);
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
    var studentId = that.data.stduentId;
    wx.request({
      header: {
        'content-Type': 'application/json'
      },
      dataType:'json',
      method: 'POST',
      url: 'https://lzqpp.natapp4.cc/weixin/findClassRecord/'+studentId,
      success: function(res) {
        that.setData({
          signList: res.data
        })
      }
    })
  }
})