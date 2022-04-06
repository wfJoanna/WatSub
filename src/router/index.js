import Vue from 'vue'
import VueRouter from 'vue-router'
import state from '@/store/state'
import { routes } from '@/router/routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注册全局钩子来拦截导航
router.beforeEach((to, from, next) => {
  if (state.userInfo || to.name === 'login') {
    // 必须把login给排除掉，不然就会陷入死循环
    next()
  } else {
    next({
      path: '/login'
    })
  }
})

export default router
