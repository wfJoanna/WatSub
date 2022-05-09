const tencentcloud = require('tencentcloud-sdk-nodejs-asr')

const ASR = tencentcloud.asr.v20190614.Client
const asr = new ASR({
  credential: {
    secretId: 'xxx',
    secretKey: 'xxx'
  }
})

function createSpeechTask (params) {
  return new Promise((resolve, reject) => {
    asr.CreateRecTask(params).then(
      data => {
        // console.log('taskId: ' + data)
        resolve(data.Data.TaskId)
      },
      err => {
        // console.log(err)
        reject(err)
      }
    )
  })
}

function describeTask (params) {
  return new Promise((resolve, reject) => {
    // console.log(params)
    asr.DescribeTaskStatus(params).then(
      data => {
        // console.log('data: ' + data)
        resolve(data)
      },
      err => {
        console.log(err)
        reject(err)
      }
    )
  })
}

module.exports = {
  createSpeechTask,
  describeTask
}
