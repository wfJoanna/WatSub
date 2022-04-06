/**
 * 登录
 */
import layout from '@/views/layout/layout'

export const loginRouter = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/home/login')
  }
]

/**
 * 主路由
 */
export const appRouter = [
  {
    path: '/',
    redirect: {
      name: 'home'
    },
    meta: {
      keepAlive: true
    },
    component: layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "login" */ '../views/home/HomePage')
      },
      {
        path: '/edit',
        name: 'edit',
        component: () => import(/* webpackChunkName: "login" */ '../views/edit/EditPage')
      }
    ]
  }
]

export const routes = [...loginRouter, ...appRouter]
