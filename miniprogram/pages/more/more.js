//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 授权标识

Page({
  data: {
    thisData : app.globalData,
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
                  if (res.result.login) {
                    // 将数据库查询结果保存全局变量
                    app.globalData.userInfo.openid = res.result.loginRes.data[0].openid
                    app.globalData.userInfo.avatarUrl = res.result.loginRes.data[0].avatarUrl
                    app.globalData.userInfo.nickName = res.result.loginRes.data[0].nickName
                    app.globalData.userInfo.gender = res.result.loginRes.data[0].gender
                    app.globalData.userInfo.region = res.result.loginRes.data[0].region
                    // 加载数据库的用户信息到本页面
                    that.setData({
                      thisData : app.globalData
                    })
                    logged = true //授权
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  // 按钮点击
  onGetUserInfo: function(e) {
    var that = this
    if (!logged && e.detail.userInfo) {
      // 之前未授权，且点击授权按钮
      //调用云函数登录
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          console.log('login调用结果:', res)
          if (res.result.login) {
            // 将数据库查询结果保存全局变量
            app.globalData.userInfo.openid = res.result.loginRes.data[0].openid
            app.globalData.userInfo.avatarUrl = res.result.loginRes.data[0].avatarUrl
            app.globalData.userInfo.nickName = res.result.loginRes.data[0].nickName
            app.globalData.userInfo.gender = res.result.loginRes.data[0].gender
            app.globalData.userInfo.region = res.result.loginRes.data[0].region
            // 加载数据库的用户信息到本页面
            that.setData({
              thisData : app.globalData,
            })
          } else {  //数据库不存在用户
            // 调用云函数注册
            wx.cloud.callFunction({
              name: 'register',
              data: {
                openid: app.globalData.userInfo.openid,
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName,
                gender: e.detail.userInfo.gender,
                region: [e.detail.userInfo.province + "省", e.detail.userInfo.city + "市", "全部"],
              },
              complete: res => {
                console.log('register调用结果:', res)
                // 加载数据库的用户信息到本页面
                app.globalData.userInfo.openid = res.result.openid
                app.globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl
                app.globalData.userInfo.nickName = e.detail.userInfo.nickName
                app.globalData.userInfo.gender = e.detail.userInfo.gender
                app.globalData.userInfo.region = [e.detail.userInfo.province, e.detail.userInfo.city, "全部"]
                that.setData({
                  thisData : app.globalData,
                })
              }
            })
          }
        }
      })
      logged = true
      console.log('首次登录用户信息：', e.detail.userInfo)
    } else if (logged) {// 授权，则跳转用户信息修改页面
      wx.navigateTo({
        url: '../user/user'
      })
    }
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.setData({
      thisData: app.globalData,
    })
  },
})