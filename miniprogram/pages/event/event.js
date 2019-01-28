//event.js
var desData = require('../../data/data_des.js'); // 目的地信息json数据
var dateTimeUtil = require('../../utils/dateTimeUtil.js')
var app = getApp()

Page({
  data: {
    // 界面信息
    hideAll: true, // 隐藏一切
    confirmText: "创建", // 确认按钮文本
    confirmFlag: 0, // 0为创建项目，1为更新项目，2为申请加入项目，3为退出项目
    // picker
    numberArray: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    numberIndex: 0,
    travelArray: ["步行", "公交", "自行车", "地铁", "汽车"],
    travelIndex: 0,
    desArray: [], // 目的地对象数组
    desIndex: 0,
    desNameArray: [], // 目的地名称数组
    // 项目信息
    _id: "", // 数据库:项目_id
    event: {
      name: "",
      des: "请选择", //目的地
      desIntro: "请选择目的地~", // 目的地简介
      imageUrl: "../../images/event/placeholder.png",
      date: "2019-01-01",
      time: "12:00",
      number: 2, //  人数
      travel: "步行", // 出行方式
      cost: 0, //  花费
      actors: ["", ], // 参加人的openid,第0个为创建人的openid
      apply: [".", ], // 申请加入人的openid
      votes: [1, ], // 参加人的投票，0为反对，1为赞同。创建人默认为1，其他人默认为0。
      signs: [0, ], // 参加人的签到，0为未签到，1为已签到。
      scores: [-1, ], // 参加人对项目评分，未评分为-1，范围0~10。
      score: 10, // 项目最终得分
      avatarUrl: "", // 项目创建人头像
    },
    // 用户相关
    currOpenid: "", // 当前用户openid
    isAdmin: false, // 当前用户是否为创建者
    actors: [], // 参与者的用户信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    wx.showNavigationBarLoading() // 显示导航栏加载
    var that = this
    var id = e.id
    // 初始化目的地对象/名称数组
    for (var i in desData.desArray) {
      this.data.desNameArray.push(desData.desArray[i].name)
    }
    if (id == undefined) { // 创建项目，按钮为创建项目
      this.data.event.avatarUrl = app.globalData.userInfo.avatarUrl
      this.setData({
        isAdmin: true,
        hideAll: false,
        confirmFlag: 0,
        confirmText: "创建",
      })
      wx.setNavigationBarTitle({
        title: '创建协游',
      })
      wx.hideNavigationBarLoading() // 隐藏导航栏加载
    } else { // 查看/修改/申请加入项目
      wx.cloud.callFunction({
        name: 'queryEvent',
        data: {
          _id: id,
        },
        complete: res => {
          if (res.result.query) { // 存在数据
            // picker初始选项定位
            var desIndex = that.data.desNameArray.indexOf(res.result.queryRes.data[0].event.des)
            var numberIndex = that.data.numberArray.indexOf(res.result.queryRes.data[0].event.number)
            var travelIndex = that.data.travelArray.indexOf(res.result.queryRes.data[0].event.travel)
            that.setData({
              desIndex: desIndex,
              numberIndex: numberIndex,
              travelIndex: travelIndex,
              _id: id,
              event: res.result.queryRes.data[0].event,
              hideAll: false,
            })
            // 查询所有参与者，并保存到本页面
            wx.cloud.callFunction({
              name: 'queryAllUsers',
              complete: res => {
                if (res.result.query) { // 如果存在数据
                  var allUsers = res.result.queryRes.data
                  for (var i in allUsers) {
                    if (this.data.event.actors.indexOf(allUsers[i].openid) >= 0) {
                      this.data.actors.push(allUsers[i])
                    }
                  }
                  this.setData({
                    actors: this.data.actors,
                  })
                  console.log("actors:", this.data.actors)
                }
                wx.hideNavigationBarLoading() // 隐藏导航栏加载
              }
            })
            // 判断当前用户类型
            var index = that.data.event.actors.indexOf(that.data.currOpenid)
            if (index == 0) { // 当前用户是创建者，按钮为更新
              this.setData({
                confirmFlag: 1,
                confirmText: "更新",
                isAdmin: true, // 可修改项目值
              })
            } else if (index > 0) { //  当前用户是参与者，按钮为退出
              this.setData({
                confirmFlag: 3,
                confirmText: "退出",
              })
            } else { // 非本项目成员，按钮为申请加入
              this.setData({
                confirmFlag: 2,
                confirmText: "申请加入",
              })
            }
          }
          wx.hideNavigationBarLoading() // 隐藏导航栏加载
        }
      })
    }
    // 更新本页数据
    this.setData({
      desArray: desData.desArray,
      desNameArray: this.data.desNameArray,
      currOpenid: app.globalData.userInfo.openid,
    })
  },
  /**
   * 输入框函数--项目名
   */
  bindNameInput: function(e) {
    this.data.event.name = e.detail.value
  },
  /**
   * 选择器函数--目的地
   */
  bindDesChange: function(e) {
    this.data.event.des = this.data.desArray[e.detail.value].name
    this.data.event.desIntro = this.data.desArray[e.detail.value].intro
    this.data.event.imageUrl = this.data.desArray[e.detail.value].imageUrl
    this.setData({
      desIndex: e.detail.value,
      event: this.data.event
    })
  },
  /**
   * 输入框函数--花费
   */
  bindCostInput: function(e) {
    this.data.event.cost = e.detail.value
  },
  /**
   * 选择器函数--日期
   */
  bindDateChange: function(e) {
    console.log('日期为', e.detail.value)
    this.data.event.date = e.detail.value
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 选择器函数--时间
   */
  bindTimeChange: function(e) {
    console.log('时间为', e.detail.value)
    this.data.event.time = e.detail.value
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 选择器函数--人数
   */
  bindNumberChange: function(e) {
    console.log('人数为', this.data.numberArray[e.detail.value])
    this.data.event.number = this.data.numberArray[e.detail.value]
    this.setData({
      numberIndex: e.detail.value,
      event: this.data.event
    })
  },
  /**
   * 选择器函数--出行方式
   */
  bindTravelChange: function(e) {
    console.log('出行方式为', this.data.travelArray[e.detail.value])
    this.data.event.travel = this.data.travelArray[e.detail.value]
    this.setData({
      travelIndex: e.detail.value,
      event: this.data.event
    })
  },
  /**
   * 点击函数--确认修改
   */
  bindConfirm: function() {
    var that = this
    if (this.data.confirmFlag == 0) { // 创建项目操作
      this.data.event.actors[0] = this.data.currOpenid
      console.log("event：", app.globalData.userInfo.avatarUrl)
      //  数据库操作-添加项目
      wx.cloud.callFunction({
        name: 'addEvent',
        data: {
          event: this.data.event,
        },
        complete: res => {
          console.log('addEvent调用结果:', res)
          // 更新notice
          app.globalData.userInfo.notice.push({
            a: "../../images/notice/add.png",
            dt: dateTimeUtil.formatDT(new Date()),
            txt: "您" + that.data.confirmText + "了项目:<" + that.data.event.name + ">",
          })
          wx.cloud.callFunction({
            name: 'updateUser',
            data: {
              appData: app.globalData,
            },
            complete: res => {
              console.log('updateUser调用结果:', res)
              if (res.result.update) {
                //页面返回
                wx.navigateBack({
                  delta: 1
                })
                wx.showToast({
                  title: this.data.confirmText + '成功！',
                })
              }
            },
            fail: console.error
          })
        },
        fail: console.error
      })
    } else{ // 更新项目/申请加入/退出操作
      if (this.data.confirmFlag == 1) { // 更新项目操作
        app.globalData.userInfo.notice.push({
          a: "../../images/notice/update.png",
          dt: dateTimeUtil.formatDT(new Date()),
          txt: "您更新了项目:<" + that.data.event.name + ">",
        })
      } else if (this.data.confirmFlag == 2) { // 申请加入项目操作
        var index = this.data.event.apply.indexOf(this.data.currOpenid)
        if (index < 0) {
          this.data.event.apply.push(this.data.currOpenid)
          this.setData({
            event: this.data.event,
          })
          app.globalData.userInfo.notice.push({
            a:  "../../images/notice/apply.png",
            dt: dateTimeUtil.formatDT(new Date()),
            txt: "您申请加入了项目:<" + that.data.event.name + ">",
          })
        }
      } else if (this.data.confirmFlag == 3) { // 退出项目操作
        
      }
      //  数据库操作-更新项目
      wx.cloud.callFunction({
        name: 'updateEvent',
        data: {
          _id: this.data._id,
          event: this.data.event,
        },
        complete: res => {
          console.log('updateEvent调用结果:', res)
          if (res.result.update) {
            // 更新notice
            wx.cloud.callFunction({
              name: 'updateUser',
              data: {
                appData: app.globalData,
              },
              complete: res => {
                console.log('updateUser调用结果:', res)
                if (res.result.update) {
                  //页面返回
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.showToast({
                    title: that.data.confirmText + '成功！',
                  })
                }
              },
              fail: console.error
            })
          }
        },
        fail: console.error
      })
    }
  }
})