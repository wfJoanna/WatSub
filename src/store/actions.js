import * as api from '@/api/api'

export default {
  login (context, data) {
    return api.userLogin(data)
  },
  register (context, data) {
    return api.userRegister(data)
  },
  createProject (context) {
    return api.projectCreate()
  },
  getProjects (context) {
    return api.projectGet()
  },
  getResources (context) {
    return api.resourceGet()
  },
  deleteProject (context, data) {
    return api.projectDelete(data)
  },
  deleteResource (context, data) {
    return api.resourceDelete(data)
  },
  uploadFile (context, data) {
    return api.fileUpload(data)
  },
  createSpeechRecognition (context, data) {
    return api.speechRecognition(data)
  },
  saveProject (context) {
    return api.projectSave(context.state.projectInfo).then(res => {
      context.commit('set_project_info', Object.assign({}, context.state.projectInfo, { updateTime: res }))
    })
  },
  getNewestProjectInfo (context) {
    return api.newestProject(context.state.projectInfo.projectId).then(res => {
      context.commit('set_project_info', res)
      return res
    })
  }
}
