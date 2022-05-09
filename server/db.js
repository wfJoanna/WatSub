const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/watsub')

const db = mongoose.connection
db.on('error', function () {
  console.log('数据库连接出错！')
})
db.on('open', function () {
  console.log('数据库连接成功！')
})

// 声明schema
const userSchema = mongoose.Schema({
  userId: String,
  username: String,
  password: String
})
const projectSchema = mongoose.Schema({
  projectId: String,
  title: String,
  userId: String,
  createTime: String,
  updateTime: String,
  resource: String,
  subtitleList: Array,
  speaker: Array,
  status: String,
  taskId: String,
  aiResult: String
})
const resourceSchema = mongoose.Schema({
  resourceId: String,
  resource: String,
  uploadTime: String,
  userId: String
})
const model = {
  User: mongoose.model('User', userSchema),
  Project: mongoose.model('Project', projectSchema),
  Resource: mongoose.model('Resource', resourceSchema)
}

module.exports = model
