//more_user.js
var app = getApp()

Page({
  data: {
    thisData: app.globalData,
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
   * 性别选择器函数
   */
  bindSexChange: function(e) {
    console.log('性别为', e.detail.value)
    this.data.thisData.userInfo.gender = e.detail.value
    this.setData({
      thisData: this.data.thisData
    })
  },
  /**
   * 地区选择器函数
   */
  bindRegionChange: function(e) {
    console.log('地区为', e.detail.value)
    this.data.thisData.userInfo.region = e.detail.value
    this.setData({
      thisData: this.data.thisData
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