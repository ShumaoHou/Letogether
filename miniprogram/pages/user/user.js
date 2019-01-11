//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

Page({
  data: {
    thisData: app.globalData,
    tempData: app.globalData, //用于缓存thisData数据
  },
  // 性别选择器事件
  bindPickerChange: function(e) {
    console.log('性别为', e.detail.value)
    this.data.tempData.userInfo.gender = e.detail.value
    this.setData({
      tempData: this.data.tempData
    })
  },
  // 地区选择器事件
  bindRegionChange: function(e) {
    console.log('地区为', e.detail.value)
    this.data.tempData.userInfo.region = e.detail.value
    this.setData({
      tempData: this.data.tempData
    })
  },
  // 上传图片
  doUpload: function() {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = app.globalData.userInfo.openid + "/avatar/avatar" + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            console.log('[上传文件] 成功：', cloudPath)
            console.log('[上传文件] 成功：', filePath)
            that.data.tempData.fileID = res.fileID
            that.data.tempData.cloudPath = cloudPath
            that.data.tempData.imagePath = filePath
            that.data.tempData.userInfo.avatarUrl = filePath
            that.setData({
              tempData: that.data.tempData,
            })
            console.log('tempApp：' + tempData)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //确认按钮事件
  bindConfirm: function() {
    app.globalData = this.data.tempData
    this.setData({
      thisData: this.data.tempData, //将缓存app数据赋给app
    })
    //数据库更新
    
    wx.navigateBack({
      delta: 1
    })
  }
})