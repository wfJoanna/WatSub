<template>
  <div class="home-page">
    <div class="create-project">
      <div class="create-svg" @click="handleCreate">
        <svg t="1649223068897" class="icon" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="1935">
          <path
            d="M563.839471 0.00096a163.199847 163.199847 0 0 1 117.43989 49.279954l68.895936 71.455933A108.767898 108.767898 0 0 0 828.479223 153.600816h344.863677C1232.222845 153.600816 1279.9988 199.456773 1279.9988 256.00072v665.599376c0 56.543947-47.743955 102.399904-106.6559 102.399904H106.6559C47.775955 1024 0 978.144043 0 921.600096V102.400864C0 45.856917 47.743955 0.00096 106.6559 0.00096H563.839471zM671.99937 224.00075h-63.99994a95.99991 95.99991 0 0 0-95.99991 95.99991v95.99991h-111.999895A111.999895 111.999895 0 0 0 287.99973 528.000465v63.99994a111.999895 111.999895 0 0 0 111.999895 111.999895H511.99952v127.99988a95.99991 95.99991 0 0 0 95.99991 95.99991h63.99994a95.99991 95.99991 0 0 0 95.99991-95.99991v-127.99988h111.999895a111.999895 111.999895 0 0 0 111.999895-111.999895v-63.99994a111.999895 111.999895 0 0 0-111.999895-111.999895l-111.999895-0.032V320.00066a95.99991 95.99991 0 0 0-95.99991-95.99991z"
            fill="#2C3167" p-id="1936"></path>
          <path
            d="M639.9994 284.448693c-29.215973 0-52.89595 23.135978-52.89595 51.711952v181.02383h-185.119827c-29.215973 0-52.89595 23.135978-52.89595 51.711952 0 28.543973 23.679978 51.711952 52.89595 51.711951h185.119827v181.02383c0 28.543973 23.679978 51.711952 52.89595 51.711952s52.89595-23.167978 52.89595-51.711952v-181.02383h185.119827c29.215973 0 52.89595-23.167978 52.89595-51.711951 0-28.575973-23.679978-51.711952-52.89595-51.711952h-185.119827v-181.02383c0-28.575973-23.679978-51.711952-52.89595-51.711952z"
            fill="#9299EA" p-id="1937"></path>
        </svg>
      </div>
    </div>
    <div class="my-projects">
      <el-table :data="projects" :default-sort="{prop: 'updateTime', order: 'descending'}" v-loading="projectLoading"
                element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 1)">
        <el-table-column label="项目名" width="300" sortable>
          <template slot-scope="scope">
            <el-button type="text" @click="handleOpenProject(scope.row)" style="margin-right: 5px">{{ scope.row.title }}</el-button>
            <el-tag type="success" size="mini" v-if="scope.row.status==='3'">识别完成</el-tag>
            <el-tag type="info" size="mini" v-if="scope.row.status==='2'">识别失败</el-tag>
            <el-tag size="mini" v-if="scope.row.status==='1'">识别中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="400" sortable></el-table-column>
        <el-table-column prop="updateTime" label="上次更新时间" width="400" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'HomePage',
  data () {
    return {
      projects: [],
      projectLoading: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['set_project_info']),
    ...mapActions(['createProject', 'getProjects', 'deleteProject']),
    handleCreate () {
      this.createProject().then(res => {
        this.set_project_info(res)
        this.$router.push({
          path: '/edit'
        })
      })
    },
    handleOpenProject (item) {
      this.set_project_info(item)
      this.$router.push({
        path: '/edit'
      })
    },
    handleDelete (item) {
      this.deleteProject(item.projectId).then(res => {
        this.$message.success('删除成功')
        this.handleGetProjects()
      })
    },
    handleGetProjects () {
      this.projectLoading = true
      this.projects = []
      this.getProjects().then(res => {
        this.projects = res
        this.projectLoading = false
      }).catch(() => {
        this.projectLoading = false
      })
    }
  },
  created () {
    this.set_project_info(null)
    this.handleGetProjects()
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  .create-project {
    margin: 30px 30px;

    .create-svg {
      width: 73px;
      cursor: pointer;
    }
  }

  .my-projects {
    margin: 30px 30px;
  }
}
</style>
