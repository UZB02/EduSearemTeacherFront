import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import HomeView from '../views/HomeView.vue'

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Group/GroupIdView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/auth/loginView.vue'),
      meta: {
        layout: AuthLayout,
      },
    },
  ],
})

export default router
