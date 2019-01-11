//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 授权标识

Page({
  data: {
    avatarUrl: app.globalData.userInfo.avatarUrl, //用户头像
    nickName: app.globalData.userInfo.nickName, //昵称
    gender: app.globalData.userInfo.gender, //性别
    region: ['广东省', '广州市', '海珠区'], //地区
  },
  // 查看是否授权
  onLoad: function() {
    var that = this
    wx.getSetting({
      success: function(res) {
        //如果用户已经授权过
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              //调用云函数登录
              wx.cloud.callFunction({
                name: 'login',
                complete: res => {
                  console.log('login调用结果:', res)
                  app.globalData.userInfo.openid = res.result.data[0].openid
                  app.globalData.userInfo.avatarUrl = res.result.data[0].avatarUrl
                  app.globalData.userInfo.nickName = res.result.data[0].nickName
                  app.globalData.userInfo.gender = res.result.data[0].gender
                  app.globalData.userInfo.region = res.result.data[0].region
                  // 加载数据库的用户信息
                  that.setData({
                    avatarUrl: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                    gender: app.globalData.userInfo.gender,
                    region: app.globalData.userInfo.region,
                  })
                }
              })
              logged = true //授权
            }
          })
        }
      }
    })
  },
  // 按钮点击
  onGetUserInfo: function(e) {
    if (!logged && e.detail.userInfo) {
      // 之前未授权，且点击授权按钮
      // 调用云函数注册
      wx.cloud.callFunction({
        name: 'register',
        data: {
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName,
          gender: e.detail.userInfo.gender,
          region: [e.detail.userInfo.province + "省", e.detail.userInfo.city + "市", "全部"],
        },
        complete: res => {
          console.log('register调用结果:', res)
        }
      })
      logged = true
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        gender: e.detail.userInfo.gender,
        region: [e.detail.userInfo.province + "省", e.detail.userInfo.city + "市", "全部"],
      })
      console.log('首次登录用户信息：', e.detail.userInfo)

    } else if (logged) {// 授权，则跳转用户信息修改页面
      wx.navigateTo({
        url: '../user/user'
      })
    }
  },
})