//index.js
var util = require('../../utils/util.js')
var desData = require('../../data/data_des.js'); // 目的地信息json数据
var app = getApp()

Page({
  data: {
    feed: [],
    feed_length: 0,
  },
  /**
   * 项目点击函数
   */
  bindEventTap: function(e) {
    var id = e.currentTarget.dataset.id // 传递数据库_id
    console.log("_id:", id)
    wx.navigateTo({
      url: '../event/event?id=' + id
    })
  },
  /**
   * ‘创建协游’按钮点击函数
   */
  bindCreateEvent: function() {
    wx.navigateTo({
      url: '../event/event'
    })
  },
  /**
   * 页面显示函数
   */
  onShow: function() {
    var that = this
    app.userLoginCheck(function (openid) {
      if (openid == "") { //未登录，跳转登陆页面
        wx.switchTab({
          url: '../more/more',
        })
      } else {
        wx.showNavigationBarLoading() // 显示导航栏加载
        console.log('onShow', openid)
        wx.cloud.callFunction({
          name: 'queryAllEvents',
          complete: res => {
            if (res.result.query) { // 如果存在数据
              that.setData({
                feed: res.result.queryRes.data
              });
              console.log("querAllEvents:", res.result.queryRes.data)
            }
            wx.hideNavigationBarLoading() // 隐藏导航栏加载
          }
        })
      }
    })
  },
})