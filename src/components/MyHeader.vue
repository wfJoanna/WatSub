<template>
  <div class="my-header">
    <div class="header-left">
      <div class="logo" @click="goHome">
        <div class="logo-img">
          <svg t="1649220996349" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="1674">
            <path
              d="M828.465335 900.361927h-81.522914l-26.171563-68.587544h-120.329025l-24.66745 68.587544h-79.717979l117.320799-300.822562h94.458285z m-136.272621-143.793184l-32.488836-87.238543-30.683902 86.93772z"
              fill="#231815" p-id="1675"></path>
            <path
              d="M300.822562 572.766157v360.987074a90.246769 90.246769 0 0 0 90.246768 90.246769h541.480611a90.246769 90.246769 0 0 0 90.246769-90.246769v-360.987074a90.246769 90.246769 0 0 0-90.246769-90.246768H391.06933a90.246769 90.246769 0 0 0-90.246768 90.246768z m601.645123 360.987074H421.151586a30.082256 30.082256 0 0 1-30.082256-30.082256v-300.822561a30.082256 30.082256 0 0 1 30.082256-30.082257h481.316099a30.082256 30.082256 0 0 1 30.082256 30.082257v300.822561a30.082256 30.082256 0 0 1-30.082256 30.082256zM631.426557 318.871915l-180.493537 120.329025a30.082256 30.082256 0 0 1-46.92832-24.968273v-240.658049a30.082256 30.082256 0 0 1 46.92832-24.968273l180.493537 120.329025a30.082256 30.082256 0 0 1 0 49.936545z"
              fill="#231815" p-id="1676"></path>
            <path
              d="M120.329025 572.766157a30.082256 30.082256 0 0 1-30.082256-30.082256v-421.151586a30.082256 30.082256 0 0 1 30.082256-30.082256h782.13866a30.082256 30.082256 0 0 1 30.082256 30.082256v270.740305h90.246769v-300.822561a90.246769 90.246769 0 0 0-90.246769-90.246769H90.246769a90.246769 90.246769 0 0 0-90.246769 90.246769v481.316098a90.246769 90.246769 0 0 0 90.246769 90.246769h120.329024v-90.246769z"
              fill="#231815" p-id="1677"></path>
          </svg>
        </div>
        <div class="logo-text">WATSUB</div>
      </div>
      <div class="project" v-if="projectInfo" :class="{'editing':isEditing}" @click="handleEdit">{{
          projectInfo.title
        }}
      </div>
      <input class="input" type="text" @blur="handleBlur" :class="{'editing':!isEditing}" v-model="projectTitle"
             ref="inputTitle">
      <div class="save" v-if="projectInfo">
        <div class="save-time">上次保存于 {{ this.projectInfo ? this.projectInfo.updateTime : '' }}</div>
        <el-button size="mini" @click="handleSave">保存</el-button>
      </div>
    </div>
    <div class="header-right">
      <div class="user-box">
        <div class="is-login" v-if="userInfo">
          <el-dropdown trigger="click" @command="handleCommand" placement="bottom">
          <span class="user-dropdown">
            {{ userInfo.username }}<i class="el-icon-arrow-down" style="margin-left: 6px"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-button class="no-login" type="text" v-else @click="goLogin">登录</el-button>
      </div>
      <div class="task-list"></div>
      <div class="github"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'MyHeader',
  data () {
    return {
      isEditing: false,
      projectTitle: ''
    }
  },
  computed: {
    ...mapState(['userInfo', 'projectInfo'])
  },
  methods: {
    ...mapMutations(['logout', 'set_project_info']),
    ...mapActions(['saveProject']),
    goLogin () {
      this.$router.push({
        path: '/login'
      })
    },
    goHome () {
      if (this.$route.name !== 'home') {
        this.$router.push({
          path: '/home'
        })
      }
    },
    handleCommand (command) {
      if (command === 'exit') {
        this.logout()
        this.$message.success('退出登录成功')
        this.$router.push({
          path: '/login'
        })
      }
    },
    handleEdit () {
      this.isEditing = true
      const item = this.$refs.inputTitle
      this.$nextTick(() => {
        item.focus()
      })
    },
    handleBlur () {
      if (!this.projectTitle) {
        this.projectTitle = this.projectInfo.title
      } else {
        this.set_project_info(Object.assign({}, this.projectInfo, { title: this.projectTitle }))
      }
      this.isEditing = false
    },
    handleSave () {
      this.saveProject().then(res => {
        this.$message.success('保存成功')
      })
    }
  },
  watch: {
    projectInfo: {
      handler: function (val) {
        this.projectTitle = val ? val.title : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-header {
  width: 100%;
  height: 70px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 70px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 99;

  .header-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
      flex: 1 1 auto;

      .logo-img {
        width: 32px;
        margin-right: 9px;
      }

      .logo-text {
        font-weight: bolder;
      }
    }

    .project {
      margin-left: 30px;
      padding: 0 10px;
      cursor: pointer;
      height: 30px;
      line-height: 30px;

      &:hover {
        background: #f2f2f2;
      }
    }

    .editing {
      display: none;
    }

    .input {
      margin-left: 30px;
      width: 145px;
    }

    .save {
      display: flex;
      align-items: center;
      margin-left: 30px;

      .save-time {
        margin-right: 15px;
        font-size: small;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .user-box {
      .is-login {
        cursor: pointer;
        //display: flex;
        //align-items: center;
      }
    }
  }

}
</style>
