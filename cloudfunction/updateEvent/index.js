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
  console.log("更新event：",event)
  try {
    res = await db
    .collection('events')
    .doc(event._id)
    .update({
      data: {
        event: event.event,
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