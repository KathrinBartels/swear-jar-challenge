import { createRouter, createWebHistory } from 'vue-router'
import SwearJar from '@/views/SwearJar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      name: 'SwearJar',
      component: SwearJar
    },
    {
      path: '/dashboard',
      name: 'DashboardView',
      component: () => import('@/views/DashboardView.vue')
    }
  ]
})

export default router
