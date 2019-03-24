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
      notice: [], // 针对个人的通知
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLaunch: function() {
    var that = this
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
  /**
   * 检查用户是否已注册
   */
  userLoginCheck: function(cb) {
    var that = this
    var openid = ''
    wx.getSetting({
      success: function(res) {
        //如果用户已经授权过
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              //调用云函数登录
              wx.cloud.callFunction({
                name: 'queryUser',
                complete: res => {
                  console.log('queryUser调用结果:', res)
                  if (res.result.query) { // 用户已注册
                    var resData = res.result.queryRes.data[0]
                    // 将数据库查询结果保存全局变量
                    that.globalData.userInfo = resData
                    openid = resData.openid
                  }
                  typeof cb == "function" && cb(openid) //返回输出
                },
                fail: e => {
                  typeof cb == "function" && cb(openid) //返回输出
                },
              })
            },
            fail: e => {
              typeof cb == "function" && cb(openid) //返回输出
            },
          })
        } else {
          typeof cb == "function" && cb(openid) //返回输出
        }
      }
    })
  },
  /**
   * 移除数组中的元素
   */
  arrayRemove: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }
    return -1;
  },
})