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
 * @param data 项目名称、创建时间、用户名
 */
export const projectCreate = data =>
  iAxios.post('/api/project/create', data)

/**
 * @method 获取项目列表
 * @param username 用户名（用户唯一标识）
 */
export const projectGet = username =>
  iAxios.get(`/api/project/getByUser?username=${username}`)
