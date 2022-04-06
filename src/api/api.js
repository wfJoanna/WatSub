import iAxios from '@/api/axios'

/**
 * @method 登录
 * @param data 用户名和密码
 */
export const userLogin = data =>
  iAxios.post('/api/login', data)

/**
 * @method 注册
 * @param data 用户名和密码
 */
export const userRegister = data =>
  iAxios.post('/api/register', data)
