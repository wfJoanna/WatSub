const Project = require('../db').Project

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

// 新建项目
const Create = async ctx => {
  const project = new Project({
    title: ctx.request.body.title,
    projectId: ctx.request.body.projectId,
    username: ctx.request.body.username,
    createTime: ctx.request.body.createTime,
    updateTime: ctx.request.body.updateTime
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
    returnData: '',
    returnDesc: '新建项目成功'
  }
}

// 获取用户所有项目
const GetProjects = async ctx => {
  const param = {
    username: ctx.request.query.username
  }
  const doc = await findAllProjects(param)
  // console.log(doc)
  ctx.body = {
    returnCode: 0,
    returnData: doc,
    returnDesc: ''
  }
}

module.exports = {
  Create,
  GetProjects
}
