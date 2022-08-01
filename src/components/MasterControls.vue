<template>
  <!-- Master: Benutzerverwaltung -->
    <div class="master" v-if="submittedAdd">
      <h3 id="master_h3">Übersicht der Benutzer</h3>
      <button @click="addUser()">Hinzufügen</button><br><br>
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
            <img src="../assets/pen.png" alt="Edit" width="20" @click="update(kurs)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(kurs.id, kurs.bezeichnung)"></td>
        </tr>
        <tr class="benutzer-container" v-for="pers in dozenten" :key="pers.id">
          <td>{{pers.vorname}}</td>
          <td>{{pers.nachname}}</td>
          <td>{{pers.email}}</td>
          <td>Dozent</td>
          <td>
            <img src="../assets/pen.png" alt="Edit" width="20" @click="update(kurs)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(kurs.id, kurs.bezeichnung)">
          </td>
        </tr>
      </table>
    </div>
    <PopupUserControl></PopupUserControl>
</template>

<script>

import * as main from '../main.js'

import PopupUserControl from './PopupUserControl.vue';

import StudentDataService from '@/services/StudentDataService';
import DozentDataService from "../services/DozentDataService";

export default {
  components: {
    PopupUserControl
  },
  data(){
    return {
      studenten: [],
      dozenten: [],
      submittedAdd: true
    }
  },
	methods: {

		// Öffnet das Add-Pop-up Fenster 
    addUser(){
      this.submittedAdd = false;
    },
    
		getDozenten(){
      this.dozenten = DozentDataService.getAll()
        .then(response => {
          this.dozenten = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    getStudenten(){
      this.studenten = StudentDataService.getAll()
        .then(response => {
          this.studenten = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    switchUserRole(){
      main.switchUserRole();		
    }
	},
  mounted() {
    // this.getStudenten();
    this.getDozenten();
  }
}
</script>

<style>
.master{
  margin-left: 40px;
}
</style>