<template>
  <!-- Master: Benutzerverwaltung -->
    <div class="master" v-if="submittedStud && submittedDoz && submittedDelete">
      <h3 id="master_h3">Übersicht der Benutzer</h3>
      <!-- Lister aller Stundenten und Dozenten -->
      <table>
        <tr>
          <th>Vorname</th>
          <th>Name</th>
          <th>Email</th>
          <th>Benutzerrolle</th>
          <th>Studiengang</th>
          <th>Aktion</th>
        </tr>
        <tr class="benutzer-container" v-for="pers in studenten" :key="pers.id">
          <td>{{pers.vorname}}</td>
          <td>{{pers.nachname}}</td>
          <td>{{pers.email}}</td>
          <td>Student</td>
          <td>{{pers.studiengang}}</td>
          <td>   
            <img src="../assets/pen.png" alt="Edit" width="20" @click="updateStud(pers)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(pers, true)"></td>
        </tr>
        <tr class="benutzer-container" v-for="pers in dozenten" :key="pers.id">
          <td>{{pers.vorname}}</td>
          <td>{{pers.nachname}}</td>
          <td>{{pers.email}}</td>
          <td>Dozent</td>
          <td>-</td>
          <!-- Icons zum Ändern und Löschen der Benutzer -->
          <td>
            <img src="../assets/pen.png" alt="Edit" width="20" @click="updateDoz(pers)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(pers, false)">
          </td>
        </tr>
      </table>
    </div>
    <!-- Popups zum Modifizieren und Löschen der Nutzer -->
    <!-- Über das ref-Attribut, kann auf die Kind-Komponenten zugegriffen werden -->
    <PopupStudentModi ref="student" v-show="!submittedStud"></PopupStudentModi>
    <PopupDozentModi ref="dozent" v-show="!submittedDoz"></PopupDozentModi>
    <PopupDeleteUser v-if="!submittedDelete"></PopupDeleteUser>
</template>

<script>

// Single File Components
import PopupStudentModi from './PopupStudentModi.vue';
import PopupDozentModi from './PopupDozentModi.vue';
import PopupDeleteUser from './PopupDeleteUser.vue';

// Services
import StudentDataService from '@/services/StudentDataService';
import DozentDataService from "@/services/DozentDataService";

export default {
  components: {
    PopupStudentModi,
    PopupDozentModi,
    PopupDeleteUser
  },
  data(){
    return {
      studenten: [],
      dozenten: [],
      submittedStud: true,
      submittedDoz: true,
      submittedDelete: true,
      currentStudent: null,
      currentDozent: null,
      isStudent: null,
      profil: false
    }
  },
	methods: {
    // lädt alle Dozenten aus der Datenbank
		getDozenten(){
      this.dozenten = DozentDataService.getAll()
        .then(response => {
          this.dozenten = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    // lädt alle Studenten aus der Datenbank
    getStudenten(){
      this.studenten = StudentDataService.getAll()
        .then(response => {
          this.studenten = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    /**
     * setzt den ausgewählten Studenten als akutelles Objekt
     * Informiert die Kind-Komponente über den isSetup-Bool-Wert
     * über das setzen des akutellen Objekts und öffnet über 
     * den Bool-Wert submittedStud das Popup-Fenster
     */
    updateStud(student){
      this.currentStudent = student;
      this.$refs.student.isSetup = true;
      this.submittedStud = false;
    },

    /**
     * setzt den ausgewählten Dozenten als akutelles Objekt
     * Informiert die Kind-Komponente über den isSetup-Bool-Wert
     * über das setzen des akutellen Objekts und öffnet über 
     * den Bool-Wert submittedDoz das Popup-Fenster
     */
    updateDoz(dozent){
      this.currentDozent = dozent;
      this.$refs.dozent.isSetup = true;
      this.submittedDoz = false;
    },

    /**
     * Nimmt das akutelle Nutzerobjekt und den Bool-Wert isStudent entgegen.
     * Abhängig von der Benutzerrolle wird das akutelle Benutzerobjekt gesetzt.
     * Anschließend wird das Popup zu Löschen geöffnet.
     * @param {object} currentUser - Objekt des ausgewählten Studenten oder Dozenten
     * @param {boolean} isStudent - gibt an ob es sich um einen Studenten oder Dozenten handelt
     */
    deleteById(currentUser, isStudent){
      this.isStudent = isStudent;
      if(bool) {
        this.currentStudent = currentUser;
      } else {
        this.currentDozent = currentUser;
      }
      this.submittedDelete = false;
    },

    // holt alle Benutzer aus der Datenbank
    getUsers(){
      this.getStudenten();
      this.getDozenten();
    }
	},
  // beim Aufruf der Komponente werden alle Benutzer aus der Datenbank geholt
  mounted() {
    this.getUsers();
  }
}
</script>

<style>

td{
  padding: 5px;
  padding-right: 20px;
  padding-left: 0px;
}

th{
  padding: 5px;
  padding-right: 20px;
  padding-left: 0px;
}

</style>