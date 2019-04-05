// index.js
const regeneratorRuntime = require('../common/regenerator-runtime.js')
// 获取应用实例
const app = getApp()

Page({
  isLoaded: false,

  data: {
    albums: []
  },

  // 应用初始化检查登录态
  onLoad() {
    this.checkUser()
  },

  // onShow 的时候获取相册列表
  onShow() {
    if (this.isLoaded) {
      this.getAlbums()
    }
  },

  // 检查是否有用户
  async checkUser() {
    const db = wx.cloud.database({})

    const user = await db.collection('user').get()

    // 如果没有用户，跳转到登录页面登录
    if (!user.data.length) {
      const db = wx.cloud.database({})

      // 插入用户信息
      let result = await db.collection('user').add({
        data: {
          nickName: app.globalData.userInfo.nickName,
          albums: []
        }
      })
    wx.navigateTo({
      url: '../personalalbum/personalalbum',
    })
      app.globalData.nickName = user.nickName
      app.globalData.id = result._id
   



    }

    const userinfo = user.data[0]
    app.globalData.hasUser = true
    app.globalData.id = userinfo._id
    app.globalData.nickName = userinfo.nickName
    app.globalData.allData.albums = userinfo.albums

    // 从用户信息中获取相册
    this.getAlbums(userinfo.albums)
  },

  // 获取相册列表
  async getAlbums(albumsParam) {
    const albums = albumsParam || app.globalData.allData.albums

    for (const album of albums) {
      if (!album) {
        continue
      }

      // 相册中有照片
      // 拿第一张照片作为相册封面
      if (album.photos.length) {
        const fileID = album.photos[0].fileID

        // 获取封面的真实链接
        const { fileList } = await wx.cloud.getTempFileURL({ fileList: [fileID] })

        album.coverURL = fileList[0].tempFileURL
        continue
      }

      // 相册中没有照片
      // 则设置为默认的相册封面
      album.coverURL = '/images/default-cover.png'
    }

    this.setData({ albums })
    this.isLoaded = true
  }
})
