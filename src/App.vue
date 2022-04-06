<template>
  <div id="app">
    <my-header v-if="$route.name!=='login'"></my-header>
    <router-view></router-view>
  </div>
</template>
<script>
import ChangeTheme from './utils/ChangeTheme.js'
import MyHeader from '@/components/MyHeader'

export default {
  components: { MyHeader },
  methods: {
    handleLoad () {
      ChangeTheme.initCss().then(data => {
        ChangeTheme.changeTheme('#4a47a3')
      }).catch()
    }
  },
  created () {
    window.addEventListener('load', this.handleLoad)
  }

}
</script>
<style>
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
</style>
