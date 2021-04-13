//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    studentList:[],
    placeArray: [],
    index: 0,
    index2:0,
    courseArray:[],
    showDialog: false,
    studentName:"",
    studentId:""
  },
  onload: function(options) {
    
    
    
  },
  onShow() {
   var that = this;
    that.queryAllPlace();
    that.selectStudentList(1);
  },
  onReady: function(e) {
    
  },
  bindPickerChange: function(e) {  
    var that = this;
    console.log(e.detail.value);
      that.setData({
        index: e.detail.value
       })
       var indes = e.detail.value;
       var dataid = that.data.placeArray[indes]['id'];
       that.selectStudentList(dataid);
    },
	selectStudentList:function(placeId){
      var that = this;
		 wx.request({
		    url: "http://localhost:8080/weixin/queryStudentByPlace/"+placeId,
        method: 'POST',
        header: {
          'content-Type': 'application/json'
        },
        dataType:'json',
		    success: function(res) {
          that.setData({
            studentList: res.data
           })
		    }
		});
  },
  onItemClick:function(e){
    var that = this;
    var id = e.currentTarget.dataset.source.id;
    var name = e.currentTarget.dataset.source.name;

    that.setData({
      showDialog: true,
      studentName:name,
      studentId:id
    })

    that.queryAllCourse();
},
queryAllPlace:function(e){
  console.log(8888);
  var that = this;
  wx.request({
    url: "http://localhost:8080/weixin/queryPlaces",
    data:{
      
    },
    method: 'POST',
    header: {
      'content-Type': 'application/json'
    },
    dataType:'json',
    success: function(res) {
      console.log(res);
      that.setData({
        placeArray: res.data
       })
    }
});
},
queryAllCourse:function(e){
  var that = this;
  wx.request({
    url: "http://localhost:8080/weixin/queryCoures",
    data:{
      
    },
    method: 'POST',
    header: {
      'content-Type': 'application/json'
    },
    dataType:'json',
    success: function(res) {
      console.log(res);
      that.setData({
        courseArray: res.data
       })
    }
  });
},
bindPickerChange2: function(e) {  
  var that = this;
  console.log(e.detail.value);
    that.setData({
      index2: e.detail.value
     })
     var indes = e.detail.value;
     var dataid = that.data.courseArray[indes]['id'];
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });

  },
  confirm:function(e) {
    var that = this;

    var phone = wx.getStorageSync("phoneNumber");

    var studentId = that.data.studentId;
    
    var placeId = that.data.placeArray[that.data.index]['id'];
    var courseId = that.data.courseArray[that.data.index2]['id'];

    if(phone==""){
      console.log("未绑定手机号");
      that.toggleDialog();
    }else{
        wx.request({
          url: "http://localhost:8080/weixin/studentSignByCoach",
          data:{
            "studentId":studentId,
            "placeId":placeId,
            "remarks":phone,
            "courseId":courseId
          },
          header: {
            'content-Type': 'application/json'
          },
          dataType:'json',
          method: 'POST',
          success: function(res) {
            if(res.data.code==200){
              wx.showModal({
                title: '提示',
                content: '签到成功',
                showCancel: false
              })
              that.toggleDialog();
            }    
          }
      });
    }
      

   }
})