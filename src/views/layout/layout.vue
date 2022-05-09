<template>
  <div class="layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'layout'
}
</script>

<style lang="scss" scoped>
.layout {
  padding-top: 70px + 20px;
  height: 100vh;
  min-height: 715px;
  //padding-left: 70px;
  //padding-right: 70px;
}
</style>
