//event.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

Page({
  data: {
    thisData: app.globalData,
    numberArray: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    travelArray: ["步行", "公交", "自行车", "地铁", "汽车"],
    event: {
      // 项目信息
      eventid: 1, // 项目id
      name: "我的协游",
      destination: "目的地",
      date: "2019-01-01",
      time: "12:00",
      number: 2,//  人数
      travel: "步行",// 出行方式
      cost: 0,//  花费
      actors: [app.globalData.userInfo.openid,],// 参加人的openid,第0个为创建人的openid
      votes: [1,], // 参加人的投票，0为反对，1为赞同。创建人默认为1，其他人默认为0。
      signs: [0,], // 参加人的签到，0为未签到，1为已签到。
      scores: [-1,], // 参加人对项目评分，未评分为-1，范围0~10。
      score: 10, // 项目最终得分
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.setData({
      thisData: app.globalData
    })
  },
  /**
   * 日期选择器函数
   */
  bindDateChange: function(e) {
    console.log('日期为', e.detail.value)
    this.data.event.date = e.detail.value
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 时间选择器函数
   */
  bindTimeChange: function (e) {
    console.log('时间为', e.detail.value)
    this.data.event.time = e.detail.value
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 人数选择器函数
   */
  bindNumberChange: function(e) {
    console.log('人数为', this.data.numberArray[e.detail.value])
    this.data.event.number = this.data.numberArray[e.detail.value]
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 出行方式选择器函数
   */
  bindTravelChange: function (e) {
    console.log('出行方式为', this.data.travelArray[e.detail.value])
    this.data.event.travel = this.data.travelArray[e.detail.value]
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 确认修改按钮点击函数
   */
  bindConfirm: function() {
    // //将本页app数据赋给全局
    // app.globalData = this.data.thisData
    // //数据库更新
    // wx.cloud.callFunction({
    //   name: 'updateUser',
    //   data: {
    //     appData: this.data.thisData,
    //   },
    //   complete: res => {
    //     console.log('updateUser调用结果:', res)
    //     if (res.result.update) {
    //       //页面返回
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }
    //   },
    //   fail: console.error
    // })
  }
})