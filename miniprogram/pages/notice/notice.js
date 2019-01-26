//notice.js
var app = getApp()

Page({
  data: {
    feed: [],
    feed_length: 0,
    deleteModalHidden: true, // 对话框隐藏
    deleteItemName: "",// 当前被删除的项目名称
    list_type: 0, // 项目列表类型。0：我创建的协游；1：我参加的协游；2：协游加入申请。
    _id: "", // 点击的event _id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var type = e.type
    if (type == "created") { // 我创建的协游
      this.setData({
        list_type: 0,
        deleteHidden: false,
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
    console.log('onLoad')
    this.queryAllEvents()
  },
  /**
   * 查询数据库并更新event列表
   */
  queryAllEvents: function() {
    wx.showNavigationBarLoading() // 显示导航栏加载
    wx.cloud.callFunction({
      name: 'queryAllEvents',
      data: {
        type: this.data.list_type,
      },
      complete: res => {
        if (res.result.query) { // 如果存在数据
          var type = this.data.list_type
          var feedData = []
          var resData = res.result.queryRes.data
          for (var i = 0; i < resData.length; i++) {
            if (type == 0) { // 我创建的协游
              if (resData[i].event.actors[0] == app.globalData.userInfo.openid) {
                feedData.push(resData[i])
              }
            } else if (type == 1) { // 我参加的协游
              if (resData[i].event.actors.indexOf(app.globalData.userInfo.openid) > 0) {
                feedData.push(resData[i])
              }
            } else if (type == 2) { // 协游加入申请

            }
          }
          this.setData({
            feed: feedData,
          });
          console.log("querAllEvents:", res.result.queryRes.data)
        }
        wx.hideNavigationBarLoading() // 隐藏导航栏加载
      }
    })
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
   * 点击函数--项目删除
   */
  bindDeleteTap: function(e) {
    var id = e.currentTarget.dataset.id // 传递数据库_id
    this.data._id = id
    console.log("Delete _id:", id)
    if (this.data.list_type == 0) {
      this.setData({
        deleteModalHidden: false,
        deleteItemName: e.currentTarget.dataset.name,
      })
    }
  },
  /**
   * 对话框--删除确认
   */
  bindDeleteConfirm: function(e) {
    wx.cloud.callFunction({
      name: 'deleteEvent',
      data: {
        _id: this.data._id,
      },
      complete: res => {
        this.queryAllEvents()
      }
    })
    this.setData({
      deleteModalHidden: true,
    })
  },
  /**
   * 对话框--删除取消
   */
  bindDeleteCancel: function(e) {
    this.setData({
      deleteModalHidden: true,
    })
  },
})