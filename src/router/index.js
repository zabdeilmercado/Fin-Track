import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import TransactionView from '@/views/system/TransactionsView.vue'
import CategoriesView from '@/views/system/CategoriesView.vue'
import SettingsPage from '@/views/system/SettingsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/transaction',
    name: 'transaction',
    component: TransactionView,
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
  },
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
