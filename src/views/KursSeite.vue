<template>
  <div>
    <!-- Der container wird nur angezeigt, wenn keine Popups angezeigt werden -->
    <div class="container" v-if="submittedAdd && submittedUpdate && submittedDelete">
    
      <!-- Es werden Kurs-Informationen zum ausgewählten Kurs ausgegeben -->
      <div class="course-container">
        <h2 id="course-title">{{ kurs.bezeichnung }}</h2>
        <div class="flex-container">
          <div>
            <span> Semester: {{kurs.semester}}</span>
            <div v-for="doz in dozenten" :key="doz.id">
              <span>Dozent: {{doz.titel}} {{doz.nachname}}</span>
            </div>
          </div>
          <!-- Studenten können sich über einen Link aus dem Kurs ausschreiben -->
          <div id="ausschreiben" v-if="userRole=='Student'">
            <router-link to="/">
              <strong @click="ausschreiben(kurs.id)">Ausschreiben</strong>
            </router-link>
          </div>
        </div>
      </div>
      <!-- Dozent: Button zum Aufruf des Popups um Kurse hinzuzufügen -->
      <div v-if="userRole=='Dozent'">
        <button @click="addAufgabe()">Aufgabe hinzufügen</button>
        <!-- <button @click="test()">download test</button> -->
      </div>

      <!-- Übersicht der Aufgaben im Kurs -->
      <div class="excercises-container" v-for="aufgabe in aufgaben" :key="aufgabe.id">
        <div>
          <router-link class="listItem" :to="{ name: 'aufgabe', params:{ id: aufgabe.id, bezeichnung: kurs.bezeichnung, kursId: kurs.id}}">       
            <strong >{{aufgabe.bezeichnung}}</strong>
          </router-link>
        </div>
        <!-- Dozent: Icons zum Ändern und Löschen der Aufgaben -->
        <div id="controls" v-if="userRole=='Dozent'">
          <img src="../assets/pen.png" alt="Edit" width="20" @click="update(aufgabe)">&nbsp;
          <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteExcercise(aufgabe)">
        </div> 
      </div>
    </div>
    <!-- Popups für die Manipulation von Aufgaben -->
    <PopupAddExcercise  v-if="!submittedAdd"></PopupAddExcercise>
    <PopupUpdateExcercise  v-if="!submittedUpdate"></PopupUpdateExcercise>
    <PopupDeleteExcercise v-if="!submittedDelete"></PopupDeleteExcercise>
  </div>
</template>


<script>
// SFCs
import PopupAddExcercise from '@/components/PopupAddExcercise.vue';
import PopupUpdateExcercise from '@/components/PopupUpdateExcercise.vue';
import PopupDeleteExcercise from '@/components/PopupDeleteExcercise.vue';

// Services
import KursDataService from '@/services/KursDataService';


export default {
  name: 'KursSeite',
  props: ['id'],
  components: {
    PopupAddExcercise,
    PopupUpdateExcercise,
    PopupDeleteExcercise
  },
  data() {
    return {
      aufgaben: [],
      dozenten: [],
      kurs: {
        id: this.id,
        bezeichnung: "",
        semester: ""
      },
      userRole: "",
      submittedAdd: true,
      submittedUpdate: true,
      submittedDelete: true,
      currentAufgabe: {}
    }
  },    
  methods: {

    
    /**
     * Holt die Kursdaten mit den dazugehörigen Aufgaben und Dozenten des Kurses
     * @param {number} kursId - Id des ausgewählten Kurses
     */
    getKursById(kursId){
      KursDataService.get(kursId)
        .then(response => {
            this.dozenten = response.data.dozents;
            this.aufgaben = response.data.aufgaben;
            this.kurs.bezeichnung = response.data.bezeichnung;
            this.kurs.semester = response.data.semester;
            this.setCurrentKurs();
        })
        .catch(e => {
          console.log(e);
        });
    },

    /**
     * Entfernt den Studenten aus dem Kurs
     * @param {number} kursId - Id des ausgewählten Kurses
     */
    ausschreiben(kursId){
      KursDataService.delete(kursId, this.$store.state.student.id)
        .catch(e => {
          alert("Es ist ein Fehler aufgetreten!")
          console.log(e);
        })
    },

    /**
     * Setzt die aktuelle Aufgabe und öffnet, über das Setzen
     * eines Boolean-Werts, das Update-Popup
     * @param {object} aufgabe - Objekt der ausgewählten Aufgabe 
     */
    update(aufgabe){
      this.currentAufgabe = aufgabe;
      this.submittedUpdate = false;
    },

    /**
     * Setzt die aktuelle Aufgabe und öffnet, über das Setzen
     * eines Boolean-Werts, das Delete-Popup
     * @param {object} aufgabe - Objekt der ausgewählten Aufgabe 
     */
    deleteExcercise(aufgabe){
      this.currentAufgabe = aufgabe;
      this.submittedDelete = false;
    },
    
    // Benutzerrolle aus dem globalen Speicher (state) wird lokal gesetzt
    setUserRole() {
      this.userRole = this.$store.state.user.realm_access.roles[0];
    },

    // Öffnet das Popup zum Hinzufügen einer Aufgabe
    addAufgabe(){
        this.submittedAdd = false;
    },

    /**
     * Speichert den aktuellen Kurs im state
     */
    setCurrentKurs(){
      const currentKurs = {
        "id": this.kurs.id,
        "bezeichnung": this.kurs.bezeichnung,
        "semester": this.kurs.semester,
        "aufgaben": this.aufgaben
      }
      this.$store.dispatch('setKurs', currentKurs);
    }
  },
  /**
   * Beim Aufbau der Seite wird die Benutzerrolle und 
   * der Kurs gesetzt
   */
  mounted() {
    this.setUserRole();
    this.getKursById(this.kurs.id);
  },
  /**
   * watcher für die aufgaben-Variable
   * wird diese geändert, werden die Aufgaben neu aus der 
   * Datenbank geholt
   */
  watch: {
    aufgaben(){
      this.getKursById(this.kurs.id);
    }
  }
}
</script> 


<style>

.container{
  margin-left: 40px;
}

.course-container{
  margin-top: 20px;
  margin-bottom: 20px;
  text-decoration: none;
}

#course-title{
  margin-left: 0px;
  text-decoration: none;
}

.excercises-container{
  margin-top: 20px;
}

.listItem{
  text-decoration: none;
  font-size: 24px;
}

#controls{
  margin-right: 800px;
}

.excercises-container{
  margin-top: 40px;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
}

.flex-container{
  display: flex;
  justify-content: space-between;
}

#ausschreiben{
  margin-right: 200px;
}

</style>

