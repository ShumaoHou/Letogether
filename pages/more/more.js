//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var wx_login = "https://api.weixin.qq.com/sns/jscode2session?"
+ "appid=" 
+ "wx6d128398b04d6b40" 
+ "&secret=" 
+ "346b42a6161c88bde859417d9a88c18c"
+ "&js_code="
var pageObject = {
  data: {
    motto: 'Hello World',
    userInfo: {},
    openid: "",
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: ''
    })
  },
  //微信授权登录
  onGotUserInfo: function (e) {
    var that = this
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        that.setData({
          userInfo: e.detail.userInfo
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success(res) {
            console.log('登录成功！')
            if (res.code) {
              // 发起网络请求
              wx.request({
                method: 'GET',
                url: wx_login + res.code + "&grant_type=authorization_code",
                data: {
                  code: res.code
                },
                // 获取openid
                success: res => {
                  that.data.openid = res.data.openid;
                  console.log("app的openid:" + that.data.openid);
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
}
Page(pageObject)