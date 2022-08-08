import { createRouter, createWebHistory } from 'vue-router'
import StartSeite from '../views/StartSeite.vue'
import KursSeite from '../views/KursSeite.vue'
import AufgabenSeite from '../views/AufgabenSeite.vue'
import PunkteUebersicht from '../views/Student/PunkteUebersicht.vue'
import FeedbackView from '../views/Student/FeedbackView.vue'
import KursAuswertung from '../views/Dozent/KursAuswertung.vue'
import KursTeilnehmer from '../views/Dozent/KursTeilnehmer.vue'
import ProfilSeite from '../views/ProfilSeite.vue'
// import TutorialsList from '../components/TutorialsList.vue'
// import Tutorial from '../components/Tutorials.vue'
// import AddTutorial from '../components/AddTutorial.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: StartSeite
  },
  {
    path: '/kurs/:id',
    name: 'kurs',
    component: KursSeite,
    props: true
  },
  {
    path: '/aufgabe/:id',
    name: 'aufgabe',
    component: AufgabenSeite,
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
    name: 'ProfilSeite',
    component: ProfilSeite,
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
