// var dateTimeUtil = require('../../utils/dateTimeUtil.js')
// var time = dateTimeUtil.formatTime(new Date())
// var date = dateTimeUtil.formatDate(new Date())
// var dt = dateTimeUtil.formatDateTime(new Date())

const formatTime = date => {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join("-")
}

const formatDateTime = date => {
  return formatDate(date) + " " + formatTime(date)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDT: formatDateTime,
};