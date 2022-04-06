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
  username: String,
  password: String
})
const projectSchema = mongoose.Schema({
  title: String,
  projectId: String,
  username: String,
  createTime: String,
  updateTime: String
})
const model = {
  User: mongoose.model('User', userSchema),
  Project: mongoose.model('Project', projectSchema)
}

module.exports = model
