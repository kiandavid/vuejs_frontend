import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CourseViewStud from '../views/CourseViewStud.vue'
import ExcerciseViewStud from '../views/ExcerciseViewStud.vue'
import PunkteUebersicht from '../views/Student/PunkteUebersicht.vue'
import FeedbackView from '../views/Student/FeedbackView.vue'
import KursAuswertung from '../views/Dozent/KursAuswertung.vue'
import KursTeilnehmer from '../views/Dozent/KursTeilnehmer.vue'
import ProfileView from '../views/ProfileView.vue'
// import TutorialsList from '../components/TutorialsList.vue'
// import Tutorial from '../components/Tutorials.vue'
// import AddTutorial from '../components/AddTutorial.vue'

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
  {
    path: '/profil',
    name: 'ProfilView',
    component: ProfileView,
    // props: true
  }
  // , {
  //   path: "/tutorials",
  //   name: "tutorials",
  //   component: TutorialsList
  // },
  // {
  //   path: "/tutorials/:id",
  //   name: "tutorial-details",
  //   component: Tutorial
  // },
  // {
  //   path: "/add",
  //   name: "add",
  //   component: AddTutorial
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
