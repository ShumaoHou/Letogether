/**
 * 注册函数
 * 将当前用户信息插入到数据库中。
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化云函数
cloud.init()
// 数据库变量
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  if (event.openid != wxContext.OPENID) {
    await db.collection('users').add({
      data: {
        openid: wxContext.OPENID,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        gender: event.gender,
        region: event.region,
      }
    })
  }
  return {
    openid: wxContext.OPENID,
  }
}