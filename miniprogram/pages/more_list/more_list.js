//more_list.js
var util = require('../../utils/util.js')
var desData = require('../../data/data_des.js'); // 目的地信息json数据
var app = getApp()

Page({
  data: {
    feed: [],
    feed_length: 0,
    list_type: 0, // 项目列表类型。0：我创建的协游；1：我参加的协游；2：协游加入申请。
  },
  /**
   * 点击函数--项目列表
   */
  bindEventTap: function(e) {
    var id = e.currentTarget.dataset.id // 传递数据库_id
    console.log("_id:", id)
    wx.navigateTo({
      url: '../event/event?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var type = e.type
    if (type == "created") { // 我创建的协游
      this.setData({
        list_type: 0,
      })
      wx.setNavigationBarTitle({
        title: '我创建的协游',
      })
    } else if (type == "involved") { // 我参加的协游
      this.setData({
        list_type: 1,
      })
      wx.setNavigationBarTitle({
        title: '我参加的协游',
      })
    } else if (type == "apply") { // 协游加入申请
      this.setData({
        list_type: 2,
      })
      wx.setNavigationBarTitle({
        title: '协游加入申请',
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showNavigationBarLoading() // 显示导航栏加载
    console.log('onLoad')
    var that = this
    wx.cloud.callFunction({
      name: 'queryAllEvent',
      data: {
        type: that.data.list_type,
      },
      complete: res => {
        if (res.result.query) { // 如果存在数据
          var type = that.data.list_type
          var feedData = []
          var resData = res.result.queryRes.data
          for (var i = 0; i < resData.length; i++) {
            if (type == 0) {// 我创建的协游
              if (resData[i].event.actors[0] == app.globalData.userInfo.openid){
                feedData.push(resData[i])
              }
            } else if (type == 1) {// 我参加的协游
              if (resData[i].event.actors.indexOf(app.globalData.userInfo.openid)>0) {
                feedData.push(resData[i])
              }
            } else if (type == 2) {// 协游加入申请

            }
          }
          that.setData({
            feed: feedData,
          });
          console.log("querAllEvent:", res.result.queryRes.data)
        }
        wx.hideNavigationBarLoading() // 隐藏导航栏加载
      }
    })
  },

})