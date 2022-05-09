const Resource = require('../db').Resource
const cos = require('../ai/cos')

// 查找资源项
const findResource = param => {
  return new Promise((resolve, reject) => {
    Resource.findOne(param, (err, doc) => {
      if (err) {
        reject(err)
      }
      resolve(doc)
    })
  })
}

// 找到所有符合条件的资源
const findAllResources = param => {
  return new Promise((resolve, reject) => {
    Resource.find(param, (err, doc) => {
      if (err) {
        reject(err)
      }
      resolve(doc)
    })
  })
}

const deleteResource = resourceId => {
  return new Promise((resolve, reject) => {
    Resource.deleteOne({ resourceId: resourceId }, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const Util = require('../util')

// 上传资源
const Upload = async (resourceUrl, userId) => {
  const doc = await findResource({
    resource: resourceUrl
  })
  if (doc) {
    doc.uploadTime = Util.getNowYMDHMS()
    await new Promise((resolve, reject) => {
      doc.save((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  } else {
    const resource = new Resource({
      resourceId: Util.guid(),
      resource: resourceUrl,
      uploadTime: Util.getNowYMDHMS(),
      userId: userId
    })
    await new Promise((resolve, reject) => {
      resource.save((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}

// 获取用户所有资源
const GetResources = async ctx => {
  const docs = await findAllResources({
    userId: ctx.state.userId
  })
  // console.log(doc)
  ctx.body = {
    returnCode: 0,
    returnData: docs,
    returnDesc: ''
  }
}

// 删除资源
const DeleteResource = async ctx => {
  const doc = await findResource({ resource: 'https://watsub-1302621827.cos.ap-chengdu.myqcloud.com/' + ctx.request.query.url })
  if (!doc) {
    console.log('该资源不存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '该资源不存在'
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
        await cos.deleteObject(ctx.request.query.url)
        await deleteResource(doc.resourceId)
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

module.exports = {
  Upload,
  GetResources,
  DeleteResource
}
