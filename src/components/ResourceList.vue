<template>
  <div class="resource-list">
    <el-table :data="resourceList">
      <el-table-column label="资源名">
        <template slot-scope="scope">
          <el-button type="text" @click="handleOpenResource(scope.row)">{{ getName(scope.row.resource) }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDownload(scope.row)" size="mini">下载</el-button>
          <el-button @click="handleDelete(scope.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ResourceList',
  props: {
    videoSrc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      resourceList: []
    }
  },
  methods: {
    ...mapActions(['getResources', 'deleteResource']),
    getName (str) {
      return str.replace('https://watsub-1302621827.cos.ap-chengdu.myqcloud.com/', '').split('_')[1]
    },
    getResourceList () {
      this.getResources().then(res => {
        this.resourceList = res
      })
    },
    handleOpenResource (item) {
      this.$emit('changeResource', item.resource)
    },
    handleDelete (item) {
      this.deleteResource(item.resource.replace('https://watsub-1302621827.cos.ap-chengdu.myqcloud.com/', '')).then(res => {
        this.$message.success('删除成功')
        this.getResourceList()
        if (item.resource === this.videoSrc) {
          this.$emit('clearSrc')
        }
      })
    },
    handleDownload (item) {
      const downloadEle = document.createElement('a')
      downloadEle.download = ''
      downloadEle.href = item.resource.replace('https://watsub-1302621827.cos.ap-chengdu.myqcloud.com', '/aaa')
      document.body.appendChild(downloadEle)
      downloadEle.click()
      document.body.removeChild(downloadEle)
    }
  },
  created () {
    this.getResourceList()
  }
}
</script>

<style scoped>

</style>
