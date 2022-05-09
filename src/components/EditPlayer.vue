<template>
  <div class="edit-player">
    <div class="player-panel">
      <div class="resource" v-if="url">
        <video class="player-video" :src="url" controls></video>
      </div>
      <div class="empty-resource" v-else></div>
    </div>
    <div class="player-control"></div>
  </div>
</template>

<script>

export default {
  name: 'EditPlayer',
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-player{
  width: 100%;
  height: 100%;
}
</style>
