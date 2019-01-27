// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 数据库变量
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var update = true
  var res = {}
  console.log("更新：",event)
  try {
    res = await db.collection('users').where({
      openid: wxContext.OPENID
    }).update({
      data:{
        avatarUrl: event.appData.userInfo.avatarUrl,
        nickName: event.appData.userInfo.nickName,
        gender: event.appData.userInfo.gender,
        region: event.appData.userInfo.region,
        notice: event.appData.userInfo.notice,
      },
    })
  } catch (e) {
    update = false
    console.error(e)
  }

  return {
    update: update,
    updateRes: event,
  }
}