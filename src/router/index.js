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
      path: '/subjects',
      name: 'Subjects',
      component: () => import('../views/Subjects/SubjectsView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/tests',
      name: 'Tests',
      component: () => import('../views/Tests/TestView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/tests/:id',
      name: 'Tests Id',
      component: () => import('../views/Tests/TestIdView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/tests/:id/results',
      name: 'Tests Id Results',
      component: () => import('../views/Tests/TestResultsView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/tests/:id/add',
      name: 'Add Question by Id',
      component: () => import('../views/Tests/AddQuestionByTestId.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/tests/:id/edit-question/:index',
      name: 'Edit Question by Id',
      component: () => import('../views/Tests/EditQuestionView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/tests/add',
      name: 'AddTest',
      component: () => import('../views/Tests/AddTestView.vue'),
      meta: {
        layout: AppLayout,
      },
    },
    {
      path: '/test/:token',
      name: 'Unikal Test',
      component: () => import('../views/Vaqtincha/UnikalTestsView.vue'),
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
