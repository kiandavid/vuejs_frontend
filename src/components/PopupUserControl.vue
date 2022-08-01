<template>
  <div>

    <!-- Dozent: Pop-up für die Kurserstellung -->
    <div class="pop-up" v-if="!this.$parent.submittedAdd">
      <h3>User hinzufügen</h3>
      <div class="form-group">
        <label for="vorname">Vorname:</label><br>
        <input
          type="text"
          class="form-control"
          id="vorname"
          required
          v-model="user.vorname"
          name="vorname"
        />
      </div>
      <div class="form-group">
        <label for="nachname">Nachname:</label><br>
        <input
          type="text"
          class="form-control"
          id="nachname"
          required
          v-model="user.nachname"
          name="nachname"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label><br>
        <input
          type="text"
          class="form-control"
          id="email"
          required
          v-model="user.email"
          name="email"
        />
      </div>
      <div class="form-group">
        <label for="email">Benutzerrolle:</label><br>
        <select name="benutzerrolle" id="benutzerrolle" required v-model="user.benutzerrolle">
            <option value="master">Master</option>
            <option value="dozent">Dozent</option>
            <option value="student">Student</option>
        </select>
      </div>
      
      <button @click="saveUser()" class="btn">Speichern</button>
      <button @click="cancel()" class="btn">Abbrechen</button>
    </div>

    <!-- Dozent: Pop-up für die Änderung -->
    <!-- <div class="pop-up" v-if="!this.$parent.submittedUpdate">
      <h3>Kurs ändern</h3>
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="this.$parent.currentKurs.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="semester">Semester:</label><br>
        <input
          class="form-control"
          id="semester"
          required
          v-model="this.$parent.currentKurs.semester"
          name="semester"
        />
      </div>
      <button @click="updateKurs()" class="btn">Änderungen speichern</button>
      <button @click="cancel()" class="btn">Abbrechen</button>
    </div> -->

  </div>
</template>

<script>

import KursDataService from '@/services/KursDataService';

export default {
    name: "PopupUserControl",
    data() {
      return {
        user: {
          vorname: "",
          nachname: "",
          email: "",
          benutzerolle: ""
        },
        currentKurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        }
      }
    },
    methods: {

      // Erzeugt einen neuen Benutzer
      saveUser(){
        console.log("Save User");
      },

      // Updatet den Kurs in der DB
      updateKurs(){
        KursDataService.update(this.$parent.currentKurs.id, this.$parent.currentKurs)
        .then(response => {
          console.log(response.data);
          this.message = 'The Course was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
        this.$parent.getAllCourses();
        alert("Kurs "+ this.$parent.currentKurs.bezeichnung + " wurde geändert!");
        this.$parent.submittedUpdate = true;
      },

      // Setzt den Kursdaten der Erstellung im Formular zurück
      flushKurs(){
        this.kurs.bezeichnung = "",
        this.kurs.semester = "",
        this.kurs.id = null
      },

      flushCurrentKurs(){
        this.$parent.currentKurs.bezeichnung = "",
        this.$parent.currentKurs.semester = "",
        this.$parent.currentKurs.id = null
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.$parent.submittedAdd = true;
        // this.$parent.submittedUpdate = true;
        
      },
    }
}
</script>

<style scoped>

.form-group{
  margin-bottom: 20px;
}

.btn{
  margin-right: 20px;
}

.pop-up{
  margin-left: 40px;
}

</style>