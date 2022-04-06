import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/home/HomePage'
import state from '@/store/state'
import login from '@/views/home/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: login
  }
]

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
