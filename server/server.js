const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')

// // koa-bodyparser：
// // post请求通常会发送一个表单，或者JSON，它作为request的body发送
// // 但无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能
// // 所以需要引入koa-bodyparser，它解析request请求，把数据绑定到ctx.request.body中
// const bodyParser = require('koa-bodyparser')
// app.use(bodyParser())
const koaBody = require('koa-body')
app.use(koaBody({
  multipart: true // 支持文件上传
}))

// 父路由
const router = new Router()

// 引入数据库操作方法
const UserController = require('./controller/user')
const ProjectController = require('./controller/project')
const ResourceController = require('./controller/resource')

const { checkToken } = require('./token')

const userRouter = new Router({
  prefix: '/user' // 设置前缀
})
// 登录
userRouter.post('/login', UserController.Login)
// 注册
userRouter.post('/register', UserController.Reg)

const projectRouter = new Router({
  prefix: '/project'
})
// 新建项目
projectRouter.get('/create', checkToken, ProjectController.Create)
// 获取项目
projectRouter.get('/getByUser', checkToken, ProjectController.GetProjects)
// 删除项目
projectRouter.get('/delete', checkToken, ProjectController.DeleteProject)
// 保存项目
projectRouter.post('/save', checkToken, ProjectController.SaveProject)
// 获取最新项目信息
projectRouter.get('/info', checkToken, ProjectController.GetNewestProject)

const resourceRouter = new Router({
  prefix: '/resource'
})
// 获取资源
resourceRouter.get('/getByUser', checkToken, ResourceController.GetResources)
// 删除资源
resourceRouter.get('/delete', checkToken, ResourceController.DeleteResource)

const aiRouter = new Router({
  prefix: '/ai'
})
// 上传视频
aiRouter.post('/upload', checkToken, ProjectController.UploadFile)
// 发起语音识别
aiRouter.post('/speech', checkToken, ProjectController.CreateSpeech)

// 在父路由中注册子路由
router.use('/api', userRouter.routes(), userRouter.allowedMethods())
router.use('/api', projectRouter.routes(), projectRouter.allowedMethods())
router.use('/api', aiRouter.routes(), aiRouter.allowedMethods())
router.use('/api', resourceRouter.routes(), resourceRouter.allowedMethods())

// 注册父路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(8888, () => {
  console.log('The server is running at http://localhost:' + 8888)
})
