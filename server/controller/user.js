const User = require('../db').User

// 数据库的操作
// 根据用户名查找用户
const findUser = username => {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, doc) => {
      if (err) {
        reject(err)
      }
      resolve(doc)
    })
  })
}

// 登录
const Login = async ctx => {
  const username = ctx.request.body.username
  const password = ctx.request.body.password

  const doc = await findUser(username)

  if (!doc) {
    console.log('该用户名不存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '该用户名不存在'
    }
  } else if (doc.password === password) {
    console.log('密码正确')
    ctx.body = {
      returnCode: 0,
      returnData: {
        username
      },
      returnDesc: '密码正确'
    }
  } else {
    console.log('密码错误')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '密码错误'
    }
  }
}

// 注册
const Reg = async ctx => {
  const user = new User({
    username: ctx.request.body.username,
    password: ctx.request.body.password
  })
  const doc = await findUser(user.username)
  if (doc) {
    console.log('用户名已存在')
    ctx.body = {
      returnCode: 1,
      returnData: '',
      returnDesc: '用户名已存在'
    }
  } else {
    await new Promise((resolve, reject) => {
      user.save((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
    console.log('注册成功')
    ctx.body = {
      returnCode: 0,
      returnData: '',
      returnDesc: '注册成功'
    }
  }
}

module.exports = {
  Login,
  Reg
}
