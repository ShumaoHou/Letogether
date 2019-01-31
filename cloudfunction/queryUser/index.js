/**
 * 登录函数
 * 根据当前用户的openid，返回数据库中用户的信息。
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
  var res = await db.collection('users').where({
    openid: wxContext.OPENID
  }).get()
  
  if (res.data.length >0) {
    return {
      query: true,
      queryRes: res,
    }
  } else {
    return {
      query: false,
      queryRes: res,
    }
  }
}