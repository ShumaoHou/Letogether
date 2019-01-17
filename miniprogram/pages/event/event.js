//event.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

var desData = require('../../data/data_des.js'); // 目的地信息json数据

Page({
  data: {
    numberArray: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    numberIndex: 0,
    travelArray: ["步行", "公交", "自行车", "地铁", "汽车"],
    travelIndex: 0,
    desArray: [], // 目的地对象数组
    desIndex: 0,
    desNameArray: [], // 目的地名称数组
    event: {
      // 项目信息
      name: "我的协游",
      des: "请选择", //目的地
      desIntro: "请选择目的地~", // 目的地简介
      imageUrl: "../../images/event/placeholder.png",
      date: "2019-01-01",
      time: "12:00",
      number: 2, //  人数
      travel: "步行", // 出行方式
      cost: 0, //  花费
      actors: ["", ], // 参加人的openid,第0个为创建人的openid
      votes: [1, ], // 参加人的投票，0为反对，1为赞同。创建人默认为1，其他人默认为0。
      signs: [0, ], // 参加人的签到，0为未签到，1为已签到。
      scores: [-1, ], // 参加人对项目评分，未评分为-1，范围0~10。
      score: 10, // 项目最终得分
      // 项目创建人头像
      avatarUrl: "",
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.data.event.avatarUrl = app.globalData.userInfo.avatarUrl
    for (var i in desData.desArray) {
      this.data.desNameArray.push(desData.desArray[i].name)
    }
    this.setData({
      desArray: desData.desArray,
      desNameArray: this.data.desNameArray,
    })
  },
  /**
   * 项目名输入框
   */
  bindNameInput: function(e) {
    this.data.event.name = e.detail.value
  },
  /**
   * 目的地选择器函数
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
   * 花费输入框
   */
  bindCostInput: function(e) {
    this.data.event.cost = e.detail.value
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
  bindTimeChange: function(e) {
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
      numberIndex: e.detail.value,
      event: this.data.event
    })
  },
  /**
   * 出行方式选择器函数
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
   * 确认修改按钮点击函数
   */
  bindConfirm: function() {
    this.data.event.actors[0] = app.globalData.userInfo.openid
    console.log("event：", app.globalData.userInfo.avatarUrl)
    //数据库更新
    wx.cloud.callFunction({
      name: 'addEvent',
      data: {
        event: this.data.event,
      },
      complete: res => {
        console.log('addEvent调用结果:', res)
        //页面返回
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '创建成功！',
        })
      },
      fail: console.error
    })
  }
})