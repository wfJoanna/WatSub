<template>
  <div class="edit-page">
    <div class="edit-top">
      <div class="edit-left">
        <div class="player">
          <!--        <edit-player :url="fileSrc"></edit-player>-->
          <video class="player-video" ref="video" controls @timeupdate="handleTimeUpdate"></video>
        </div>
        <div class="subtitle-review">{{ currentSubtitle }}</div>
        <div class="setting">
          <el-button class="import-resource" @click="handleOpenForm" size="medium">导入资源</el-button>
          <input v-show="false" type="file" ref="file-button" @change="fileChange"/>
          <el-button class="upload-resource" @click="handleUpload" v-loading="uploadLoading" size="medium">上传资源
          </el-button>
          <el-button size="medium" @click="handleSetSpeaker">设置人物</el-button>
        </div>
      </div>
      <div class="edit-right">
        <div class="subtitle-btns">
          <el-popover placement="top" v-model="speechVisible" width="180">
            <p>确认发起语音识别？</p>
            <el-checkbox v-model="isSpeaker" style="margin-bottom: 14px">人物识别</el-checkbox>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="speechVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleSpeechRecognition">确认</el-button>
            </div>
            <el-button slot="reference" size="medium" v-show="!isRecognizing">发起语音识别</el-button>
          </el-popover>
          <el-button v-show="isRecognizing" size="medium">识别中...</el-button>
          <el-button class="create-subtitle" size="medium">新建字幕</el-button>
          <el-dropdown @command="handleCommand" placement="bottom" size="small">
          <span class="import-dropdown">
            导入/导出<i class="el-icon-arrow-down" style="margin-left: 6px"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="import-txt">导入txt文件</el-dropdown-item>
              <el-dropdown-item command="import-srt">导入srt文件</el-dropdown-item>
              <el-dropdown-item command="export-txt">导出txt文件</el-dropdown-item>
              <el-dropdown-item command="export-srt">导出srt文件</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-checkbox v-model="isListDepart">说话人区分</el-checkbox>
          <el-checkbox>一键添加人物名</el-checkbox>
        </div>
        <subtitle-list @changePlay="handleChangePlay" :isListDepart="isListDepart"></subtitle-list>
      </div>
    </div>
    <div class="edit-bottom">
      <div class="track"></div>
      <div id="waveform"></div>
    </div>

    <el-dialog class="import-form" title="导入资源" :visible.sync="dialogFormVisible" width="50%">
      <el-collapse accordion>
        <el-collapse-item title="本地导入">
          <el-button @click="handleInputVideo" size="small">导入本地资源</el-button>
        </el-collapse-item>
        <el-collapse-item title="资源库导入">
          <resource-list @changeResource="handleChangeResource" :videoSrc="this.$refs.video?this.$refs.video.src:''"
                         @clearSrc="handleClearSrc"></resource-list>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import WaveSurfer from 'wavesurfer.js'
import SubtitleList from '@/components/SubtitleList'
import ResourceList from '@/components/ResourceList'
import { findCurrentOne } from '../../utils/util'

let wavesurfer

export default {
  name: 'EditPage',
  components: {
    ResourceList,
    SubtitleList
  },
  computed: {
    ...mapState(['projectInfo'])
  },
  data () {
    return {
      file: '',
      dialogFormVisible: false,
      uploadLoading: false,
      speechVisible: false,
      isSpeaker: false,
      isRecognizing: false,
      isListDepart: false,
      currentSubtitle: ''
    }
  },
  methods: {
    ...mapActions(['uploadFile', 'createSpeechRecognition', 'getNewestProjectInfo']),
    ...mapMutations(['set_project_info', 'result_to_list']),
    handleTimeUpdate () {
      this.currentSubtitle = findCurrentOne(this.$refs.video ? this.$refs.video.currentTime : '', this.projectInfo.subtitleList)
      // console.log('update:', this.currentSubtitle)
    },
    handleOpenForm () {
      if (this.isRecognizing) {
        this.$message.warning('识别中，无法操作')
      } else {
        this.dialogFormVisible = true
      }
    },
    handleInputVideo () {
      this.$refs['file-button'].click()
      this.dialogFormVisible = false
    },
    fileChange () {
      this.file = this.$refs['file-button'].files[0]
      const video = this.$refs.video
      const reader = new FileReader()
      const self = this
      reader.addEventListener('load', function () {
        video.src = reader.result
        wavesurfer.load(reader.result)
        self.set_project_info(Object.assign({}, self.projectInfo, { resource: '' }))
        this.changeStatus('0')
      })
      if (this.file) {
        reader.readAsDataURL(this.file)
      }
    },
    handleUpload () {
      if (this.isRecognizing) {
        this.$message.warning('识别中，无法操作')
      } else if (!this.file) {
        this.$message.error('请先导入本地文件')
      } else {
        this.uploadLoading = true
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('projectId', this.projectInfo.projectId)
        this.uploadFile(formData).then(res => {
          this.$message.success('上传成功')
          this.set_project_info(Object.assign({}, this.projectInfo, { resource: res }))
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.uploadLoading = false
        })
      }
    },
    handleSpeechRecognition () {
      if (!this.$refs.video.src) {
        this.$message.error('请先选择资源')
        this.speechVisible = false
      } else if (!this.projectInfo.resource) {
        this.$message.error('请先上传资源')
        this.speechVisible = false
      } else {
        this.speechVisible = false
        this.createSpeechRecognition({
          url: this.projectInfo.resource,
          speakerDiarization: this.isSpeaker ? 1 : 0,
          projectId: this.projectInfo.projectId
        })
          .then(res => {
            this.isRecognizing = true
            this.set_project_info(Object.assign({}, this.projectInfo, {
              taskId: res,
              status: '1',
              subtitleList: [],
              aiResult: ''
            }))
            this.$message.success('发起语音识别成功')
            this.getAiResult()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    handleChangeResource (url) {
      this.file = null
      this.$refs.video.src = url
      if (url) {
        wavesurfer.load(url.replace('https://watsub-1302621827.cos.ap-chengdu.myqcloud.com', '/aaa'))
      }
      if (this.projectInfo.resource !== url) {
        this.set_project_info(Object.assign({}, this.projectInfo, { resource: url }))
        this.changeStatus('0')
      }
      this.dialogFormVisible = false
    },
    handleClearSrc () {
      console.log('clear video src')
      this.$refs.video.src = ''
      wavesurfer.empty()
      this.set_project_info(Object.assign({}, this.projectInfo, { resource: '' }))
      this.changeStatus('0')
      this.dialogFormVisible = false
    },
    handleCommand () {
      if (this.isRecognizing) {
        this.$message.warning('识别中，无法操作')
      }
    },
    changeStatus (status) {
      this.set_project_info(Object.assign({}, this.projectInfo, { status: status }))
    },
    getAiResult () {
      const tickFn = () => {
        setTimeout(async () => {
          const data = await this.getNewestProjectInfo()
          // console.log('settimeout:', data)
          if (data.status === '1') {
            tickFn()
          } else if (data.status === '2') {
            this.isRecognizing = false
            this.set_project_info(data)
            this.$message.error('识别失败')
          } else if (data.status === '3') {
            this.isRecognizing = false
            this.set_project_info(data)
            this.$message.success('识别完成')
            this.result_to_list()
          }
        }, 3000)
      }
      tickFn()
    },
    handleChangePlay (time) {
      this.$refs.video.currentTime = time
      this.$refs.video.play()
    },
    handleSetSpeaker () {
    }
  },
  created () {
    if (!this.projectInfo) {
      this.$message.error('请先选择项目')
      this.$router.push({
        path: '/'
      })
    } else if (this.projectInfo.status === '1') {
      this.isRecognizing = true
      this.getAiResult()
    }
  },
  mounted () {
    const video = this.$refs.video
    video.src = this.projectInfo.resource || ''
    wavesurfer = WaveSurfer.create({
      container: '#waveform',
      barHeight: 15,
      barWidth: 1,
      cursorWidth: 0,
      backgroundColor: '#413C69',
      waveColor: 'white',
      height: 70,
      interact: false
    })
    if (this.projectInfo.resource) {
      wavesurfer.load(this.projectInfo.resource.replace('https://watsub-1302621827.cos.ap-chengdu.myqcloud.com', '/aaa'))
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-page {
  padding: 0 15px 15px 15px;
  height: 100%;
  //display: flex;
  background: #F7F7F7;

  .edit-bottom {
    height: 150px;
    background: white;
    padding: 15px;

    .track {
      height: 50px;
      background: #4A47A3;
    }
  }

  .edit-top {
    height: calc(100% - 150px - 15px);
    display: flex;
    margin-bottom: 15px;

    .edit-left {
      width: 40%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
      padding: 15px;

      .player {
        height: 313px;
        margin-bottom: 15px;

        .player-video {
          width: 100%;
        }
      }

      .subtitle-review {
        background: #ebebfa;
        height: 50px;
        line-height: 50px;
        margin-bottom: 15px;
        overflow-x: auto;
        min-height: 50px;
        text-align: center;
      }

      .setting {
        //flex: 1 1 auto;
        //border: 1px solid black;
        //padding: 20px;
      }
    }

    .edit-right {
      width: calc(60% - 15px);
      margin-left: 15px;
      background: white;
      padding: 15px;

      .subtitle-btns {
        margin-bottom: 5px;

        .import-dropdown {
          margin-left: 15px;
          margin-right: 40px;
        }
      }
    }
  }
}
</style>
