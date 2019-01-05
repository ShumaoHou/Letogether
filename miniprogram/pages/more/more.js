//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

Page({
  data: {
    avatarUrl: './user-unlogin.png', // 用户头像
    nickName: "\n",
    city: "",
    province: "",
    country: ""
  },
  //微信授权登录
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                city: res.userInfo.city,
                province: res.userInfo.province,
                country: res.userInfo.country
              })
              console.log('用户信息：', res.userInfo)
            },
            fail: err => {
              console.log('失败', err)
            }
          })
        }
      }
    })
  },
  // 按钮点击
  onGetUserInfo: function(e) {
    // 首次登录
    if (!logged && e.detail.userInfo) {
      logged = true
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        city: e.detail.userInfo.city,
        province: e.detail.userInfo.province,
        country: e.detail.userInfo.country
      })
      console.log('首次登录用户信息：', e.detail.userInfo)
      // 调用云函数查询用户信息
      wx.cloud.callFunction({
        name: 'loginQuery',
        complete: res => {
          console.log('loginQuery调用结果:', res)
          // 数据库无用户信息，则调用云函数插入用户信息到users
          if (res.result.data.length == 0 ) {
            wx.cloud.callFunction({
              name: 'loginAdd',
              data: {
                avatarUrl: e.detail.userInfo.avatarUrl,
                nickName: e.detail.userInfo.nickName,
                city: e.detail.userInfo.city,
                province: e.detail.userInfo.province,
                country: e.detail.userInfo.country
              },
              complete: res => {
                console.log('loginAdd调用结果:', res)
              }
            })
          } else {  // 加载数据库的用户信息
            this.setData({
              avatarUrl: res.result.data[0].avatarUrl,
              nickName: res.result.data[0].nickName,
              city: res.result.data[0].city,
              province: res.result.data[0].province,
              country: res.result.data[0].country
            })
          }
        }
      })
    
    }
  },
})