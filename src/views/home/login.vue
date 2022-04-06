<template>
  <div class="login">
    <div class="login-card">
      <div class="logo-svg">
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
      <div class="logo-title">WATSUB</div>
      <el-form class="login-form" :model="loginForm">
        <el-form-item>
          用户名：<el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item>
          密码：<el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="dialogFormVisible = true">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog class="register-form" title="注册" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="registerForm">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRegister">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: ''
      },
      dialogFormVisible: false
    }
  },
  methods: {
    ...mapMutations(['set_user_info']),
    ...mapActions(['login', 'register']),
    // 提交登录
    submitForm () {
      this.login(this.loginForm).then(res => {
        this.set_user_info(res)
        this.$message.success('登录成功')
        this.$router.push({
          path: '/'
        })
      })
    },
    // 注册
    submitRegister () {
      this.register(this.registerForm).then(res => {
        this.$message.success('注册成功，请登录')
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #413c69;

  .login-card {
    width: 350px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-radius: 8px;

    .logo-svg {
      margin: 7px 0;
      width: 50px;
    }

    .logo-title {
      margin-top: 4px;
      margin-bottom: 24px;
    }
  }
}
</style>
