import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CourseViewStud from '../views/CourseViewStud.vue'
import ExcerciseViewStud from '../views/ExcerciseViewStud.vue'
import PunkteUebersicht from '../views/Student/PunkteUebersicht.vue'
import FeedbackView from '../views/Student/FeedbackView.vue'
import KursAuswertung from '../views/Dozent/KursAuswertung.vue'
import KursTeilnehmer from '../views/Dozent/KursTeilnehmer.vue'

const routes = [
  {
    path: '/',
    name: 'homeStud',
    component: HomeView
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
  },
  {
    path: '/punkte',
    name: 'PunkteStud',
    component: PunkteUebersicht,
    // props: true
  },
  {
    path: '/feedback',
    name: 'FeedbackStud',
    component: FeedbackView,
    // props: true
  },
  {
    path: '/auswertung',
    name: 'AuswertungDoz',
    component: KursAuswertung,
    // props: true
  },
  {
    path: '/teilnehmer',
    name: 'TeilnehmerDoz',
    component: KursTeilnehmer,
    // props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
