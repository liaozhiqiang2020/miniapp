const app = getApp()

Page({
  data: {
    noticeId:'',
    noticeInfo:'',
    locationUrl:"https://lzqpp.natapp4.cc"
  },
  onLoad(options) {
    var that = this;
    var noticeInfo = JSON.parse(options.noticeInfo);
    that.setData({
      noticeInfo: noticeInfo
    })
  },
  onShow() {

  }
})