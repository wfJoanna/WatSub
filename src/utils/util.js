/**
 * 生成 32 位 uid
 */
export const guid = (function () {
  const v4 = function (len) {
    return parseInt((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return function () {
    return v4() + v4() + '-' + v4() + '-' + v4() + '-' +
      v4() + '-' + v4() + v4() + v4()
  }
})()

/**
 * 获取当前时间的 YYYY-MM-DD HH:MM:SS
 */
export const getNowYMDHMS = function () {
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const str = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
  let timeStr = date.toTimeString()
  timeStr = timeStr.substr(0, 8)
  return str + ' ' + timeStr
}
