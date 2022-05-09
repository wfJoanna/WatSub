import { createSubtitle } from '@/utils/util'

export default {
  set_user_info (state, data) {
    state.userInfo = data
    window.sessionStorage.setItem('userInfo', data)
  },
  set_project_info (state, data) {
    state.projectInfo = data
  },
  logout (state) {
    state.userInfo = null
    window.sessionStorage.removeItem('userInfo')
  },
  result_to_list (state) {
    const str = state.projectInfo.aiResult
    if (!str) return
    // const str1 = '[0:0.920,0:9.300]  听闻夏姐姐出生骁勇世家，妹妹好生景仰，我家世代骁勇，为国尽忠。\n' + '[0:9.520,0:11.776]  其实你一切现成科比。\n'
    const list = []
    const speakerList = []
    str.replace(/([^[]+)\]([^[]+)/g, (_, k, v) => {
      // console.log(k, '@', v)
      const [start, end, speaker] = k.split(',').map(item => item.replace('.', ':'))
      const content = v.trim()
      list.push(createSubtitle(start, end, content, speaker))
      if (speaker && !speakerList.find(item => item.speakerId === speaker)) {
        speakerList.push({
          speakerId: speaker,
          name: ''
        })
      }
    })
    state.projectInfo.subtitleList = list
    state.projectInfo.speaker = speakerList
  }
}
