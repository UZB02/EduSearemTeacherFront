import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import HomeView from '../views/MainPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/:id',
      name: 'Group Id View',
      component: () => import('../views/Group/GroupIdView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/loginView.vue'),
      meta: {
        layout: AuthLayout,
      },
    },
  ],
})

export default router
