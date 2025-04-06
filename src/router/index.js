import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'register',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
