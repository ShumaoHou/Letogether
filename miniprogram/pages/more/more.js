//more.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 授权标识

Page({
  data: {
    thisData: app.globalData,
  },
  /**
   * 用户登录按钮点击函数
   */
  onGetUserInfo: function(e) {
    var that = this
    if (!logged && e.detail.userInfo) {
      // 之前未授权，且点击授权按钮
      //调用云函数登录
      wx.cloud.callFunction({
        name: 'queryUser',
        complete: res => {
          console.log('queryUser调用结果:', res)
          if (res.result.query) { //  用户已注册
            var resData = res.result.queryRes.data[0]
            // 将数据库查询结果保存全局变量
            app.globalData.userInfo.openid = resData.openid
            app.globalData.userInfo.avatarUrl = resData.avatarUrl
            app.globalData.userInfo.nickName = resData.nickName
            app.globalData.userInfo.gender = resData.gender
            app.globalData.userInfo.region = resData.region
            // 加载数据库的用户信息到本页面
            that.setData({
              thisData: app.globalData, 
            })
          } else { // 用户未注册
            // 调用云函数注册
            wx.cloud.callFunction({
              name: 'addUser',
              data: {
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName,
                gender: e.detail.userInfo.gender,
                region: [e.detail.userInfo.province + "省", e.detail.userInfo.city + "市", "全部"],
              },
              complete: res => {
                console.log('addUser调用结果:', res)
                // 将数据库查询结果保存全局变量
                app.globalData.userInfo.openid = res.result.openid
                app.globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl
                app.globalData.userInfo.nickName = e.detail.userInfo.nickName
                app.globalData.userInfo.gender = e.detail.userInfo.gender
                app.globalData.userInfo.region = [e.detail.userInfo.province, e.detail.userInfo.city, "全部"]
                //  加载数据库的用户信息到本页面
                that.setData({
                  thisData: app.globalData,
                })
              }
            })
          }
        }
      })
      logged = true
      console.log('首次登录用户信息：', e.detail.userInfo)
    } else if (logged) { // 授权，则跳转用户信息修改页面
      wx.navigateTo({
        url: '../user/user'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.userInfo.openid != "") {
      this.setData({
        thisData: app.globalData,
      })
      logged = true
    }
  },

})