//notice.js
var dateTimeUtil = require('../../utils/dateTimeUtil.js')
var app = getApp()

Page({
  data: {
    feed: [],
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.setData({
      feed: [],
    })
    app.userLoginCheck(function (openid) {
      if (openid == "") { //未登录，跳转登陆页面
        wx.switchTab({
          url: '../more/more',
        })
      } else {
        wx.showNavigationBarLoading() // 显示导航栏加载
        // 更新通知列表
        wx.cloud.callFunction({
          name: 'queryUser',
          complete: res => {
            if (res.result.query) { // 如果存在数据
              var resData = res.result.queryRes.data[0]
              // 将数据库查询结果保存全局变量
              app.globalData.userInfo = resData
              // 加载数据库的用户信息到本页面
              for (var i in app.globalData.userInfo.notice) {
                that.data.feed.push(app.globalData.userInfo.notice[app.globalData.userInfo.notice.length - i - 1])
              }
              // that.data.feed = app.globalData.userInfo.notice
              that.setData({
                feed: that.data.feed,
              })
            }
            wx.hideNavigationBarLoading() // 隐藏导航栏加载
          }
        })
      }
    })
  },
})