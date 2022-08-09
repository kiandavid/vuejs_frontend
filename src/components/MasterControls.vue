<template>
  <!-- Master: Benutzerverwaltung -->
    <div class="master" v-if="submittedStud && submittedDoz && submittedDelete">
      <h3 id="master_h3">Übersicht der Benutzer</h3>
      <table>
        <tr>
          <th>Vorname</th>
          <th>Name</th>
          <th>Email</th>
          <th>Benutzerrolle</th>
          <th>Aktion</th>
        </tr>
        <tr class="benutzer-container" v-for="pers in studenten" :key="pers.id">
          <td>{{pers.vorname}}</td>
          <td>{{pers.nachname}}</td>
          <td>{{pers.email}}</td>
          <td>Student</td>
          <td>   
            <img src="../assets/pen.png" alt="Edit" width="20" @click="updateStud(pers)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(pers, true)"></td>
        </tr>
        <tr class="benutzer-container" v-for="pers in dozenten" :key="pers.id">
          <td>{{pers.vorname}}</td>
          <td>{{pers.nachname}}</td>
          <td>{{pers.email}}</td>
          <td>Dozent</td>
          <td>
            <img src="../assets/pen.png" alt="Edit" width="20" @click="updateDoz(pers)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(pers, false)">
          </td>
        </tr>
      </table>
    </div>
    <PopupStudentModi v-if="!submittedStud"></PopupStudentModi>
    <PopupDozentModi v-if="!submittedDoz"></PopupDozentModi>
    <PopupDeleteUser v-if="!submittedDelete"></PopupDeleteUser>
</template>

<script>


import PopupStudentModi from './PopupStudentModi.vue';
import PopupDozentModi from './PopupDozentModi.vue';
import PopupDeleteUser from './PopupDeleteUser.vue';

import StudentDataService from '@/services/StudentDataService';
import DozentDataService from "../services/DozentDataService";

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
      isStudent: null
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

    // Speichert die des Studenten und öffnet das Popup 
    updateStud(student){
      this.currentStudent = student;
      this.submittedStud = false;
    },

    // Speichert die des Studenten und öffnet das Popup 
    updateDoz(dozent){
      this.currentDozent = dozent;
      this.submittedDoz = false;
    },

    // Öffnet das Bestätigungsfenster fürs Löschen
    deleteById(data, bool){
      this.isStudent = bool;
      if(bool) {
        this.currentStudent = data;
      } else {
        this.currentDozent = data;
      }
      this.submittedDelete = false;
    }
	},
  mounted() {
    this.getStudenten();
    this.getDozenten();
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