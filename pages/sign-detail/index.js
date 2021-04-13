const app = getApp()

Page({
  data: {
    signList:[],
    stduentId:0
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
  bandStudent:function(){
    var that = this;
    var studentId = that.data.stduentId;
    wx.request({
      header: {
        'content-Type': 'application/json'
      },
      dataType:'json',
      method: 'POST',
      url: 'http://localhost:8080/weixin/findClassRecord/'+studentId,
      success: function(res) {
        that.setData({
          signList: res.data
        })
      }
    })
  }
})