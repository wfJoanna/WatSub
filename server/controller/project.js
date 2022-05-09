const Util = require('../util')

const Project = require('../db').Project
const User = require('../db').User
const cos = require('../ai/cos')
const asr = require('../ai/asr')

// 找到所有符合条件的项目
const findAllProjects = param => {
  return new Promise((resolve, reject) => {
    Project.find(param, (err, doc) => {
      if (err) {
        reject(err)
      }
      resolve(doc)
    })
  })
}

// 找到符合条件的一个项目
const findOneProject = param => {
  return new Promise((resolve, reject) => {
    Project.findOne(param, (err, doc) => {
      if (err) {
        reject(err)
      }
      resolve(doc)
    })
  })
}

// 根据用户id查找用户
const findUser = userId => {
  return new Promise((resolve, reject) => {
    User.findOne({ userId }, (err, doc) => {
      if (err) {
        reject(err)
      }
      resolve(doc)
    })
  })
}

const deleteProject = projectId => {
  return new Promise((resolve, reject) => {
    Project.deleteOne({ projectId: projectId }, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// 新建项目
const Create = async ctx => {
  const doc = await findUser(ctx.state.userId)
  if (!doc) {
    console.log('该用户不存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '该用户不存在'
    }
  } else {
    const project = new Project({
      title: '未命名项目',
      projectId: Util.guid(),
      userId: ctx.state.userId,
      createTime: Util.getNowYMDHMS(),
      updateTime: Util.getNowYMDHMS()
    })
    await new Promise((resolve, reject) => {
      project.save((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
    console.log('新建项目成功')
    ctx.body = {
      returnCode: 0,
      returnData: project,
      returnDesc: '新建项目成功'
    }
  }
}

// 获取用户所有项目
const GetProjects = async ctx => {
  const docs = await findAllProjects({
    userId: ctx.state.userId
  })
  // console.log(doc)
  ctx.body = {
    returnCode: 0,
    returnData: docs,
    returnDesc: '获取成功'
  }
}

// 获取该项目的最新数据
const GetNewestProject = async ctx => {
  const doc = await findOneProject({
    projectId: ctx.request.query.id
  })
  ctx.body = {
    returnCode: 0,
    returnData: doc,
    returnDesc: '获取成功'
  }
}

// 删除项目
const DeleteProject = async ctx => {
  const doc = await findOneProject({ projectId: ctx.request.query.projectId })
  if (!doc) {
    console.log('该项目不存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '该项目不存在'
    }
  } else {
    if (doc.userId !== ctx.state.userId) {
      console.log('没有删除权限')
      // console.log(doc)
      // console.log(doc.userId, ctx.state.userId)
      ctx.body = {
        returnCode: 1,
        returnData: '',
        returnDesc: '没有删除权限'
      }
    } else {
      try {
        await deleteProject(ctx.request.query.projectId)
        console.log('删除成功')
        ctx.body = {
          returnCode: 0,
          returnData: '',
          returnDesc: '删除成功'
        }
      } catch (e) {
        console.log('删除失败')
        ctx.body = {
          returnCode: 1,
          returnData: '',
          returnDesc: '删除失败'
        }
      }
    }
  }
}

const uploadResource = require('./resource').Upload

// 上传视频
const UploadFile = async ctx => {
  const param = {
    projectId: ctx.request.body.projectId
  }
  const doc = await findOneProject(param)
  if (!doc) {
    console.log('该项目不存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '该项目不存在'
    }
  } else if (doc.userId !== ctx.state.userId) {
    console.log('没有上传权限')
    // console.log(doc)
    // console.log(doc.userId, ctx.state.userId)
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '没有上传权限'
    }
  } else {
    const file = ctx.request.files.file
    const data = await cos.putObject(file, doc.userId + '_' + file.name)
    if (data) {
      // doc.set({ resource: data })
      doc.resource = 'https://' + data
      // 修改了之后一定要记得save！！
      await new Promise((resolve, reject) => {
        doc.save((err) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      })
      await uploadResource('https://' + data, doc.userId)
      ctx.body = {
        returnCode: 0,
        returnData: 'https://' + data,
        returnDesc: '上传成功'
      }
    } else {
      ctx.body = {
        returnCode: 1,
        returnData: '',
        returnDesc: '上传失败'
      }
    }
  }
}

// 语音识别
const CreateSpeech = async ctx => {
  // 这些参数请查看腾讯云文档
  const taskId = await asr.createSpeechTask({
    EngineModelType: '16k_zh_video',
    ChannelNum: 1,
    ResTextFormat: 0,
    SourceType: 0,
    SpeakerDiarization: ctx.request.body.speakerDiarization, // 是否开启说话人分离
    // SpeakerNumber: 3,
    Url: ctx.request.body.url
  })
  console.log('成功发起语音识别')
  const doc = await findOneProject({
    projectId: ctx.request.body.projectId
  })
  doc.taskId = taskId
  doc.status = '1'
  doc.subtitleList = []
  doc.aiResult = ''
  await new Promise((resolve, reject) => {
    doc.save((err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
  ctx.body = {
    returnCode: 0,
    returnData: taskId,
    returnDesc: '发起语音识别成功'
  }
  getAiResult(taskId, ctx.request.body.projectId)
  // ctx.body = {
  //   returnCode: 0,
  //   returnData: '1986077459',
  //   returnDesc: '发起语音识别成功'
  // }
  // getAiResult('1986077459', '98f4f7ef-252f-f037-e2e4-0182da5a54af')
}

const getAiResult = function (taskId, projectId) {
  const tickFn = () => {
    setTimeout(async () => {
      const data = await asr.describeTask({
        TaskId: Number(taskId)
      })
      // console.log('settimeout:', data)
      if (data.Data.Status < 2) {
        tickFn()
      } else if (data.Data.Status === 3) {
        console.log('识别失败')
        const doc = await findOneProject({
          projectId: projectId
        })
        doc.taskId = ''
        doc.status = '2'
        doc.subtitleList = []
        doc.aiResult = ''
        await new Promise((resolve, reject) => {
          doc.save((err) => {
            if (err) {
              reject(err)
            }
            resolve()
          })
        })
      } else if (data.Data.Status === 2) {
        console.log('识别完成')
        const doc = await findOneProject({
          projectId: projectId
        })
        doc.taskId = ''
        doc.status = '3'
        doc.subtitleList = []
        doc.aiResult = data.Data.Result
        await new Promise((resolve, reject) => {
          doc.save((err) => {
            if (err) {
              reject(err)
            }
            resolve()
          })
        })
      }
    }, 2000)
  }
  tickFn()
}

const SaveProject = async ctx => {
  const doc = await findOneProject({
    projectId: ctx.request.body.projectId
  })
  const newProject = ctx.request.body
  if (!doc) {
    console.log('该项目不存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '该项目不存在'
    }
  } else {
    doc.title = newProject.title
    doc.updateTime = Util.getNowYMDHMS()
    doc.resource = newProject.resource
    doc.subtitleList = newProject.subtitleList
    doc.speaker = newProject.speaker
    doc.status = newProject.status
    doc.taskId = newProject.taskId
    doc.aiResult = newProject.aiResult
    await new Promise((resolve, reject) => {
      doc.save((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
    ctx.body = {
      returnCode: 0,
      returnData: doc.updateTime,
      returnDesc: '保存成功'
    }
  }
}

module.exports = {
  Create,
  GetProjects,
  DeleteProject,
  UploadFile,
  CreateSpeech,
  SaveProject,
  GetNewestProject
}
