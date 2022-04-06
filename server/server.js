const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')

// koa-bodyparser：
// post请求通常会发送一个表单，或者JSON，它作为request的body发送
// 但无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能
// 所以需要引入koa-bodyparser，它解析request请求，把数据绑定到ctx.request.body中
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 父路由
const router = new Router()

// 引入数据库操作方法
const UserController = require('./controller/user')
const ProjectController = require('./controller/project')

// 登录
const loginRouter = new Router()
loginRouter.post('/user/login', UserController.Login)
// 注册
const registerRouter = new Router()
registerRouter.post('/user/register', UserController.Reg)
// 新建项目
const createProjectRouter = new Router()
createProjectRouter.post('/project/create', ProjectController.Create)
// 获取项目
const getProjectsRouter = new Router()
getProjectsRouter.get('/project/getByUser', ProjectController.GetProjects)

// 在父路由中注册子路由
router.use('/api', loginRouter.routes(), loginRouter.allowedMethods())
router.use('/api', registerRouter.routes(), registerRouter.allowedMethods())
router.use('/api', createProjectRouter.routes(), createProjectRouter.allowedMethods())
router.use('/api', getProjectsRouter.routes(), getProjectsRouter.allowedMethods())

// 注册父路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(8888, () => {
  console.log('The server is running at http://localhost:' + 8888)
})
