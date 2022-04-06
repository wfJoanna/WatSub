import * as api from '@/api/api'

export default {
  login (context, data) {
    return api.userLogin(data)
  },
  register (context, data) {
    return api.userRegister(data)
  }
}
