<template>
  <div class="edit-page">
    <div class="edit-left">
      <div class="player">
        <edit-player></edit-player>
      </div>
      <div class="setting"></div>
    </div>
    <div class="edit-right"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EditPlayer from '@/components/EditPlayer'

export default {
  name: 'EditPage',
  components: { EditPlayer },
  computed: {
    ...mapState(['projectInfo'])
  }
}
</script>

<style lang="scss" scoped>
.edit-page {
  padding: 0 15px 15px 15px;
  height: 100%;
  display: flex;
  background: #F7F7F7;

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
    }
    .setting{
      flex: 1 1 auto;
      border: 1px solid black;
    }
  }

  .edit-right {
    width: calc(60% - 15px);
    margin-left: 15px;
    background: white;
  }
}
</style>
