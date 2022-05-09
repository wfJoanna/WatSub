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

/**
 * 将 MM:SS.MM 转换成毫秒
 */
export const getTimeByMSM = function (msm) {
  let t = 0
  const arr = msm.split(':')
  const m = parseInt(arr[0]) * 60 * 1000
  const arr2 = arr[1].split('.')
  const s = parseInt(arr2[0]) * 1000
  const ms = parseInt(arr2[1])
  t = Math.round(m + s + ms)
  return t
}

/**
 * 将 MM:SS:MM 转换成秒
 */
export const getTimeByMSM2 = function (msm) {
  const arr = msm.split(':')
  const m = parseInt(arr[0]) * 60
  const s = parseInt(arr[1])
  const ms = parseInt(arr[2]) / 1000
  return m + s + ms
}

/**
 * 新建一条字幕
 */
export const createSubtitle = function (start, end, content, speaker) {
  return {
    id: guid(),
    start: start,
    end: end,
    content: content,
    speaker: speaker || ''
  }
}

/**
 * 获取对应时间的字幕索引
 */
export const findOne = function (start, end, list) {
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    if (item.start === start && item.end === end) {
      return i
    }
  }
  return -1
}

/**
 * 获取正在播放的字幕
 */
export const findCurrentOne = function (time, list) {
  if (!time) {
    return ''
  }
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    const start = getTimeByMSM2(item.start)
    const end = getTimeByMSM2(item.end)
    // console.log(start, end, time)
    if (start <= time && end >= time) {
      return item.content
    }
  }
  return ''
}
