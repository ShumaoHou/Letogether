// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化云函数
cloud.init()
// 数据库变量
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('users').where({
    openid: wxContext.OPENID
  }).get()
}