//more_list.js
var dateTimeUtil = require('../../utils/dateTimeUtil.js')
var app = getApp()

Page({
  data: {
    feed: [],
    deleteModalHidden: true, // 对话框隐藏
    deleteItemName: "", // 当前被删除的项目名称
    applyModalHidden: true,
    isApply: false, // 是否为申请加入页面
    allUsers: [], // 所有用户
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
        isApply: true,
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
    console.log('onShow')
    this.queryAllEvents()
  },
  /**
   * 查询数据库并更新event列表
   */
  queryAllEvents: function() {
    var that = this
    wx.showNavigationBarLoading() // 显示导航栏加载
    wx.cloud.callFunction({
      name: 'queryAllEvents',
      data: {
        type: this.data.list_type,
      },
      complete: res => {
        if (res.result.query) { // 如果存在数据
          var type = that.data.list_type
          var feedData = []
          var resData = res.result.queryRes.data
          // 遍历所有项目
          for (var i in resData) {
            if (type == 0) { // 我创建的协游
              if (resData[i].event.actors[0] == app.globalData.userInfo.openid) {
                feedData.push(resData[i])
              }
            } else if (type == 1) { // 我参加的协游
              if (resData[i].event.actors.indexOf(app.globalData.userInfo.openid) >= 0) {
                feedData.push(resData[i])
              }
            } else if (type == 2) { // 协游加入申请
              break
            }
          }
          that.setData({
            feed: feedData,
          });
          // 协游加入申请处理
          if (type == 2) {
            // 查询所有用户信息，并保存到本页面
            wx.cloud.callFunction({
              name: 'queryAllUsers',
              complete: res => {
                if (res.result.query) { // 如果存在数据
                  that.data.allUsers = res.result.queryRes.data
                  for (var i in resData) {
                    if (resData[i].event.actors[0] == app.globalData.userInfo.openid) { // 只管理我创建的协游的申请
                      for (var j = 1; j < resData[i].event.apply.length; j++) { // 遍历项目的所有申请人
                        for (var k in that.data.allUsers) {
                          if (that.data.allUsers[k].openid == resData[i].event.apply[j]) {
                            feedData.push({
                              applyEvent: resData[i],
                              applyUser: that.data.allUsers[k],
                            })
                            break
                          }
                        }
                      }
                      that.setData({
                        feed: feedData,
                      });
                    }
                  }
                }
              }
            })
          }
        }
        wx.hideNavigationBarLoading() // 隐藏导航栏加载
      }
    })
  },

  // 协游管理处理
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
    var that = this
    wx.cloud.callFunction({
      name: 'deleteEvent',
      data: {
        _id: this.data._id,
      },
      complete: res => {
        // 更新notice
        app.globalData.userInfo.notice.push({
          a: "../../images/notice/delete.png",
          dt: dateTimeUtil.formatDT(new Date()),
          txt: "您删除了项目:<" + that.data.deleteItemName + ">",
        })
        wx.cloud.callFunction({
          name: 'updateUser',
          data: {
            appData: app.globalData,
          },
          complete: res => {
            console.log('updateUser调用结果:', res)
            if (res.result.update) {
              that.queryAllEvents()
            }
          },
          fail: console.error
        })
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

  // 协游加入申请处理
  /**
   * 点击函数--申请加入同意
   */
  bindApplyYesTap: function(e) {
    var that = this
    var item = e.currentTarget.dataset.item // 传递event和user对
    wx.showNavigationBarLoading() // 显示导航栏加载
    // 更新项目信息
    wx.cloud.callFunction({
      name: 'queryEvent',
      data: {
        _id: item.applyEvent._id,
      },
      complete: res => {
        if (res.result.query) { // 存在数据
          var event = res.result.queryRes.data[0].event
          if (event.number <= event.actors.length) { // 人数以满足设定
            this.setData({
              deleteModalHidden: false,
            })
          } else { // 人数未满
            event.actors.push(item.applyUser.openid)
            app.arrayRemove(event.apply, item.applyUser.openid)
            //  数据库操作-更新项目
            wx.cloud.callFunction({
              name: 'updateEvent',
              data: {
                _id: res.result.queryRes.data[0]._id,
                event: event,
              },
              complete: res => {
                if (res.result.update) {
                  // 更新notice
                  wx.cloud.callFunction({
                    name: 'queryUser',
                    data: {
                      openid: item.applyUser.openid,
                    },
                    complete: res => {
                      if (res.result.query) { // 存在数据
                        var data = res.result.queryRes.data[0]
                        console.log(data)
                        data.notice.push({
                          a: "../../images/notice/yes.png",
                          dt: dateTimeUtil.formatDT(new Date()),
                          txt: "您对项目:<" + item.applyEvent.event.name + ">的申请已通过！您已成为其中一员！",
                        })
                        wx.cloud.callFunction({
                          name: 'updateUser',
                          data: {
                            appData: {userInfo: data},
                          },
                          complete: res => {
                            if (res.result.update) {
                              wx.hideNavigationBarLoading() // 隐藏导航栏加载
                              that.queryAllEvents()
                            }
                          },
                          fail: console.error
                        })
                      }
                    }
                  })
                }
              },
              fail: console.error
            })
          }
        }
      }
    })
  },
  /**
   * 点击函数--申请加入拒绝
   */
  bindApplyNoTap: function(e) {
    var item = e.currentTarget.dataset.item // 传递event和user对

  },
  /**
   * 对话框--加入失败确定
   */
  bindApplyConfirm: function(e) {
    this.setData({
      applyModalHidden: true,
    })
  },

})