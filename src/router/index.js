import { createRouter, createWebHistory } from 'vue-router'
import HomeViewStud from '../views/HomeViewStud.vue'

const routes = [
  {
    path: '/',
    name: 'homeStud',
    component: HomeViewStud
  },
  {
    path: '/course',
    name: 'courseStud',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CourseViewStud.vue')
  },
  {
    path: '/excercise',
    name: 'excerciseStud',
    component: () => import(/* webpackChunkName: "about" */ '../views/ExcerciseViewStud.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
