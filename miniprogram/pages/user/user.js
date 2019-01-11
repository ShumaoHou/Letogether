//logs.js
var util = require('../../utils/util.js')
var app = getApp()
var logged = false // 登录标识

Page({
  data: {
    avatarUrl: app.globalData.userInfo.avatarUrl, //用户头像
    nickName: app.globalData.userInfo.nickName, //昵称
    gender: app.globalData.userInfo.gender, //性别
    region: ['广东省', '广州市', '海珠区'], //地区
  },
  //初始化页面调用
  onLoad: function() {

  },
  // 性别选择器事件
  bindPickerChange: function(e) {
    console.log('性别为', e.detail.value)
    this.setData({
      gender: e.detail.value
    })
  },
  // 地区选择器事件
  bindRegionChange: function(e) {
    console.log('地区为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
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
            this.setData({
              avatarUrl: filePath,
            })
            console.log('头像：')
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