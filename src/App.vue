<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import ChangeTheme from './utils/ChangeTheme.js'

export default {
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
</style>
