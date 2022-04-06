import axios from 'axios'

const iAxios = axios.create({
  timeout: 10000 // 请求超过10秒即超时，返回错误
})

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
        return Promise.reject(response.data)
      }
    } else {
      return Promise.reject(response.data)
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default iAxios
