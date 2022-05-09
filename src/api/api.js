import iAxios from '@/api/axios'

/**
 * @method 登录
 * @param data 用户名和密码
 */
export const userLogin = data =>
  iAxios.post('/api/user/login', data)

/**
 * @method 注册
 * @param data 用户名和密码
 */
export const userRegister = data =>
  iAxios.post('/api/user/register', data)

/**
 * @method 新建项目
 */
export const projectCreate = () =>
  iAxios.get('/api/project/create')

/**
 * @method 获取项目列表
 */
export const projectGet = () =>
  iAxios.get('/api/project/getByUser')

/**
 * @method 删除项目
 */
export const projectDelete = data =>
  iAxios.get(`/api/project/delete?projectId=${data}`)

/**
 * @method 上传视频
 * @param data 视频流
 */
export const fileUpload = data =>
  iAxios.post('/api/ai/upload', data)

/**
 * @method 获取资源列表
 */
export const resourceGet = () =>
  iAxios.get('/api/resource/getByUser')

/**
 * @method 删除资源
 */
export const resourceDelete = data =>
  iAxios.get(`/api/resource/delete?url=${data}`)

/**
 * @method 发起语音识别
 * @param data 视频url和是否分离说话人
 */
export const speechRecognition = data =>
  iAxios.post('/api/ai/speech', data)

/**
 * @method 保存项目信息
 * @param data 项目信息
 */
export const projectSave = data =>
  iAxios.post('/api/project/save', data)

/**
 * @method 获取最新项目信息（主要用于轮询获取ai结果）
 * @param data 项目id
 */
export const newestProject = data =>
  iAxios.get(`/api/project/info?id=${data}`)
