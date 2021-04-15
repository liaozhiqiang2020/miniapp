// //app.js
// App({
//   onLaunch: function () {
//     var that = this;

//     wx.getUserInfo({
//       lang: "zh_CN",
//       success: function (res) {
//         var userInfo = res.userInfo;
//         console.log(userInfo);
//         wx.setStorageSync('userInfo', userInfo);
//       }
//     })

//     wx.login({
//       success: function (res) {
//         var service_url = 'https://lzqpp.natapp4.cc/weixin/';
//         wx.setStorageSync("code", res.code);//将获取的code存到缓存中
//         wx.request({
//           url: service_url + 'login?code=' + res.code,
//           data: {},
//           method: 'GET',
//           success: function (res) {
//             if (res.data != null && res.data != undefined && res.data != '') {
//               wx.setStorageSync("openid", res.data.openid);//将获取的openid存到缓存中(用户唯一id信息)

            
//               wx.request({
//                 url: 'https://lzqpp.natapp4.cc/weixin/findWxUserInfoByOpenId/' + res.data.openid,
//                 method: 'POST',
//                 success: function (rest) {
                  
//                   if (rest.data != null && rest.data != undefined && rest.data != '') {
                    
//                     console.log("小程序登陆成功");
//                     wx.switchTab({
//                       url: '../index/index?openid='+res.data.openid,
//                       fail:function(){
//                         console.info("跳转失败")
//                       }
//                     })
//                   }else{
//                     that.goLoginPageTimeOut(res.data.openid)
//                     return
//                   }
//                 }
//               })

//               wx.setStorageSync("sessionKey", res.data.sessionKey);
//               // console.log(res.data.sessionKey);
//               if (res.data.phoneNumber != null && res.data.phoneNumber != undefined && res.data.phoneNumber != '') {
//                 wx.setStorageSync("phoneNumber", res.data.phoneNumber);//手机号
//               }
//             }
//           }
//         });
        
//       }
//     });
//   },
//   goLoginPageTimeOut: function (openId) {
//     setTimeout(function () {
//       wx.navigateTo({
//         url: "/pages/authorize/index?openId=" + openId
//       })
//     }, 500)
//   }
// })
