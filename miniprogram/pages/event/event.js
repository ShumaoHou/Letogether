//event.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

Page({
  data: {
    thisData: app.globalData,
    event: {
      numberArray: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      travelArray: ["步行", "公交", "自行车", "地铁", "汽车"],
      name: "我的协游",
      destination: "目的地",
      date: "2019-01-01",
      time: "12:00",
      number: 2,
      travel: "步行",
      cost: 0,
    },
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
    console.log('人数为', this.data.event.numberArray[e.detail.value])
    this.data.event.number = this.data.event.numberArray[e.detail.value]
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 出行方式选择器函数
   */
  bindTravelChange: function (e) {
    console.log('出行方式为', this.data.event.travelArray[e.detail.value])
    this.data.event.travel = this.data.event.travelArray[e.detail.value]
    this.setData({
      event: this.data.event
    })
  },
  /**
   * 确认修改按钮点击函数
   */
  bindConfirm: function() {
    //将本页app数据赋给全局
    app.globalData = this.data.thisData
    //数据库更新
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        appData: this.data.thisData,
      },
      complete: res => {
        console.log('updateUser调用结果:', res)
        if (res.result.update) {
          //页面返回
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: console.error
    })
  }
})