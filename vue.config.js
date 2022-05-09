// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true // 允许跨域
      },
      '/aaa': {
        target: 'https://watsub-1302621827.cos.ap-chengdu.myqcloud.com',
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '/aaa': ''
        }
      }
      // '/ai': {
      //   target: 'https://asr.tencentcloudapi.com',
      //   changeOrigin: true // 允许跨域
      // }
    }
  }
}
