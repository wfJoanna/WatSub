const jwt = require('jsonwebtoken')

// 加密密钥
const secret = 'watsubawstbubustaw'

const createToken = function (userId) {
  const token = jwt.sign({ userId: userId }, secret)
  return token
}

const checkToken = async (ctx, next) => {
  const authorization = ctx.get('Authorization')
  if (authorization === '') {
    ctx.throw(401, 'no token detected in http headerAuthorization')
  }
  const token = authorization.split(' ')[1]
  let tokenContent
  try {
    tokenContent = await jwt.verify(token, secret)
    // console.log(tokenContent)
    ctx.state.userId = tokenContent.userId // 将信息存放到 state 中
  } catch (err) {
    ctx.throw(401, 'invalid token')
  }
  await next()
}

module.exports = {
  createToken,
  checkToken
}
