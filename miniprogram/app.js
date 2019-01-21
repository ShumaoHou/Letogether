//app.js
App({
  /**
   * 全局变量
   */
  globalData: {
    array: {
      genderArray: ['未知', '男', '女'],
    },
    userInfo: {
      openid: "",
      avatarUrl: '../../images/user/user-unlogin.png', //用户头像
      nickName: "未登录", //昵称
      gender: 0, //性别
      region: ['江苏省', '南京市', '鼓楼区'], //地区
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 初始化云函数
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },

})