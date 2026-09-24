import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import TransactionView from '@/views/system/TransactionsView.vue'
import CategoriesView from '@/views/system/CategoriesView.vue'
import { supabase } from '@/utils/supabase'
import { reportError } from '@/utils/logger'

const routes = [
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard',
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
  { path: '/budgets', name: 'budgets', component: () => import('@/views/system/BudgetsView.vue') },
  { path: '/savings', name: 'savings', component: () => import('@/views/system/SavingsView.vue') },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/system/SettingsView.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.name === 'reset-password') return true
  const isPublic = ['login', 'register'].includes(to.name)
  if (!supabase) return isPublic ? true : { name: 'login' }
  try {
    const { data, error } = await supabase.auth.getSession()
    if ((!data.session || error) && !isPublic) return { name: 'login' }
    if (data.session && isPublic) return { name: 'dashboard' }
  } catch (error) {
    reportError('Session check', error)
    return isPublic ? true : { name: 'login' }
  }
})

export default router
