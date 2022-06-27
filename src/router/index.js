import { createRouter, createWebHistory } from 'vue-router'
import HomeViewStud from '../views/HomeViewStud.vue'
import CourseViewStud from '../views/CourseViewStud.vue'
import ExcerciseViewStud from '../views/ExcerciseViewStud.vue'

const routes = [
  {
    path: '/',
    name: 'homeStud',
    component: HomeViewStud
  },
  {
    path: '/course/:id',
    name: 'courseStud',
    component: CourseViewStud,
    props: true
  },
  {
    // So sollte es eigentlich sein, aber die IDs stimmen noch nicht
    // path: '/course/:id/excercise/:id',
    path: '/excercise/:id',
    name: 'excerciseStud',
    component: ExcerciseViewStud,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
