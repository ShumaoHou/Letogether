//more.js
var dateTimeUtil = require('../../utils/dateTimeUtil.js')
var app = getApp()

Page({
  data: {
    thisData: app.globalData,
    logged: false,  // 授权标识
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.userInfo.openid != "") {
      this.setData({
        thisData: app.globalData,
        logged: true,
      })
    } else {
      wx.showToast({
        title: '您未登录，请先登录！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 点击函数--用户登录
   */
  onGetUserInfo: function(e) {
    var that = this
    if (!this.data.logged && e.detail.userInfo) {
      // 之前未授权，且点击授权按钮
      //调用云函数登录
      wx.cloud.callFunction({
        name: 'queryUser',
        complete: res => {
          console.log('queryUser调用结果:', res)
          if (res.result.query) { //  用户已注册
            var resData = res.result.queryRes.data[0]
            // 将数据库查询结果保存全局变量
            app.globalData.userInfo = resData
            // 加载数据库的用户信息到本页面
            this.setData({
              thisData: app.globalData,
              logged: true,
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
                notice: [{
                  a: "../../images/notice/smile.png",
                  dt: dateTimeUtil.formatDT(new Date()), 
                  txt: "欢迎您加入协游大家庭!"
                  }],
              },
              complete: res => {
                console.log('addUser调用结果:', res)
                // 将数据库查询结果保存全局变量
                app.globalData.userInfo = res.result
                // 加载数据库的用户信息到本页面
                this.setData({
                  thisData: app.globalData,
                  logged: true,
                })
              }
            })
          }
        }
      })
      console.log('首次登录用户信息：', e.detail.userInfo)
    } else if (this.data.logged) { // 授权，则跳转用户信息修改页面
      wx.navigateTo({
        url: '../more_user/more_user'
      })
    }
  },
  /**
   * 点击函数--我创建的协游
   */
  bindCreatedEvent: function(e) {
    wx.navigateTo({
      url: '../more_list/more_list?type=created'
    })
  },
  /**
   * 点击函数--我参加的协游
   */
  bindInvolvedEvent: function(e) {
    wx.navigateTo({
      url: '../more_list/more_list?type=involved'
    })
  },
  /**
   * 点击函数--协游加入申请
   */
  bindApplyEvent: function(e) {
    wx.navigateTo({
      url: '../more_list/more_list?type=apply'
    })
  },
})