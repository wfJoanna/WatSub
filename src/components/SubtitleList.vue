<template>
  <div class="subtitle-list">
    <!--      <div class="subtitle-list">-->
    <!--        <div v-for="(item,index) of subtitleList" :key="index" class="subtitle-item">-->
    <!--          <input class="col1" v-model="item.start"/>-->
    <!--          <input class="col2" v-model="item.end"/>-->
    <!--          <input class="col3" v-model="item.content"/>-->
    <!--        </div>-->
    <!--      </div>-->
    <el-table v-if="projectInfo.subtitleList&&projectInfo.subtitleList.length>0" :data="projectInfo.subtitleList"
              class="subtitle-list">
      <el-table-column label="内容" width="450">
        <template slot-scope="scope">
          <select v-model="scope.row.speaker" style="width: 40px;margin-right: 4px" v-show="isListDepart">
            <option v-for="item in projectInfo.speaker" :key="item.speakerId" :label="item.name||item.speakerId"
                       :value="item.speakerId"></option>
          </select>
          <input v-model="scope.row.content" class="col3">
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="100">
        <template slot-scope="scope">
          <input v-model="scope.row.start" class="col1">
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="100">
        <template slot-scope="scope">
          <input v-model="scope.row.end" class="col2">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button title="前面插入一条空白字幕" icon="el-icon-upload2" circle size="mini"
                     @click="handleBefore(scope.row)"></el-button>
          <el-button title="后面插入一条空白字幕" icon="el-icon-download" circle size="mini"
                     @click="handleAfter(scope.row)"></el-button>
          <el-button title="删除本条字幕" icon="el-icon-delete" circle size="mini"
                     @click="handleDelete(scope.row)"></el-button>
          <el-button title="从本条字幕开始播放" icon="el-icon-caret-right" circle size="mini"
                     @click="handlePlay(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="empty-list" v-else>
      <span>当前字幕列表为空，请添加字幕</span>
    </div>
  </div>
</template>

<script>
import * as Util from '@/utils/util'

import { mapState } from 'vuex'

export default {
  name: 'SubtitleList',
  // props: {
  //   subtitleList: {
  //     type: Array,
  //     default: function () {
  //       return []
  //     }
  //   }
  // },
  props: {
    isListDepart: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['projectInfo'])
  },
  // data () {
  //   return {
  //     aiResult: '[0:0.920,0:9.300]  听闻夏姐姐出生骁勇世家，妹妹好生景仰，我家世代骁勇，为国尽忠。\n' + '[0:9.520,0:11.776]  其实你一切现成科比。\n'
  //   }
  // },
  methods: {
    handleBefore (row) {
      const index = Util.findOne(row.start, row.end, this.projectInfo.subtitleList)
      this.projectInfo.subtitleList.splice(index, 0, Util.createSubtitle('', '', '', ''))
    },
    handleAfter (row) {
      const index = Util.findOne(row.start, row.end, this.projectInfo.subtitleList)
      this.projectInfo.subtitleList.splice(index + 1, 0, Util.createSubtitle('', '', '', ''))
    },
    handleDelete (row) {
      const index = Util.findOne(row.start, row.end, this.projectInfo.subtitleList)
      this.projectInfo.subtitleList.splice(index, 1)
    },
    handlePlay (item) {
      this.$emit('changePlay', Util.getTimeByMSM2(item.start))
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-list {
  text-align: center;
  padding-top: 50px;
  color: #d9d9d9;
  font-size: 20px;
}

.subtitle-list {

  input {
    border: 0px;
  }

  .col1, .col2 {
    width: 126px;
    height: 26px;
  }

  .col3 {
    width: 374px;
    height: 26px;
  }
}
</style>
