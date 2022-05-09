import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'

const iAxios = axios.create({
  timeout: 30000 // 请求超过30秒即超时，返回错误
})

iAxios.interceptors.request.use(
  config => {
    if (store.state.userInfo.token) {
      config.headers.Authorization = `token ${store.state.userInfo.token}`
    }
    return config
  }
)

iAxios.interceptors.response.use(
  function (response) {
    // 因为只要是200，axios就会resolve，而忽略了returnCode为1比如登录密码错误的情况
    // {
    //   data: {
    //     returnCode: 1,
    //     returnData: '',
    //     returnDesc: '密码错误'
    //   },
    //   status: 200
    // }
    // 所以我们要用拦截器处理一下让其reject

    if (response.status === 200) {
      if (response.data.returnCode === 0) {
        return response.data.returnData
      } else {
        Message.error(response.data.returnDesc)
        return Promise.reject(response.data)
      }
    } else {
      Message.error(response.status + ':' + response.statusText)
      return Promise.reject(response.data)
    }
  },
  function (error) {
    Message.error('响应失败！')
    return Promise.reject(error)
  }
)

export default iAxios
