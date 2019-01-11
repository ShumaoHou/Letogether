//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

Page({
  data: {
    thisApp: app,
  },
  // 性别选择器事件
  bindPickerChange: function(e) {
    console.log('性别为', e.detail.value)
    app.globalData.userInfo.gender = e.detail.value
    this.setData({
      thisApp : app
    })
  },
  // 地区选择器事件
  bindRegionChange: function(e) {
    console.log('地区为', e.detail.value)
    app.globalData.userInfo.region = e.detail.value
    this.setData({
      thisApp: app
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
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            app.globalData.userInfo.avatarUrl = filePath
            that.setData({
              thisApp : app,
            })
            console.log('thisApp：' + thisApp)
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
})