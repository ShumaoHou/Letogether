//index.js
var desData = require('../../data/data_des.js'); // 目的地信息json数据
var app = getApp()

const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    feed: [],
    // 背景音乐
    mp3: "http://www.ytmp3.cn/down/58810.mp3",
    bgm: false,
    animationData: {},  // 播放按钮转动动画
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
    // 播放按钮转动动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    var m = true;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      n = n + 1;
      if (m) {
        this.animation.rotate(360 * (n)).scale(1.2, 1.2).step()
        m = !m;
      } else {
        this.animation.rotate(360 * (n)).scale(1, 1).step()
        m = !m;
      }
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 1000)

  },
  /**
   * 背景音乐播放按钮
   */
  bindPlayInnerAudio: function() {
    let that = this;
    if (that.data.bgm) {
      that.setData({
        bgm: false,
      })
      innerAudioContext.pause(); /**  暂停音乐 */
    } else {
      that.setData({
        bgm: true,
      })
      // 播放音乐
      innerAudioContext.autoplay = true
      innerAudioContext.loop = true
      innerAudioContext.src = that.data.mp3;
      innerAudioContext.play()
    }
  },
})