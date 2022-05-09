const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')

const cos = new COS({
  SecretId: 'xxx',
  SecretKey: 'xxx'
})

function putObject (file, filename) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: 'watsub-1302621827',
      Region: 'ap-chengdu',
      Key: filename,
      // onTaskReady: function (tid) {
      //   TaskId = tid
      // },
      // onProgress: function (progressData) {
      //   console.log(JSON.stringify(progressData)) // 打印上传进度
      // },
      // 格式1. 传入文件内容
      Body: fs.readFileSync(file.path)
      // 格式2. 传入文件流，必须需要传文件大小
      // Body: fs.createReadStream(filepath),
      // ContentLength: fs.statSync(filepath).size
    }, function (err, data) {
      fs.unlinkSync(file.path)
      if (err) {
        reject(err)
      }
      resolve(data.Location)
    })
  })
}

function deleteObject (urlKey) {
  return new Promise((resolve, reject) => {
    cos.deleteObject({
      Bucket: 'watsub-1302621827',
      Region: 'ap-chengdu',
      Key: urlKey
    }, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  putObject,
  deleteObject
}
