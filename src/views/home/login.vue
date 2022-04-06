<template>
  <div class="login">
    <div class="login-card">
      <el-form class="login-form" :model="loginForm">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="dialogFormVisible = true">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="注册" :visible.sync="dialogFormVisible" width="30%">
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
          path: 'home'
        })
      }).catch(err => {
        this.$message.error(err.returnDesc)
      })
    },
    // 注册
    submitRegister () {
      this.register(this.registerForm).then(res => {
        this.$message.success('注册成功，请登录')
        this.dialogFormVisible = false
      }).catch(err => {
        this.$message.error(err.returnDesc)
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
  }
}
</style>
