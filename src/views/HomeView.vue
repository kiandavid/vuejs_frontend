<template>
  <div> 
    <h2 v-if="userRole!='Master'" id="homeTitel">Meine Kurse</h2>

    <!-- Master: Benutzerverwaltung -->
    <div class="master" v-if="userRole=='Master'">
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
          <td></td>
        </tr>
        <tr class="benutzer-container" v-for="pers in dozenten" :key="pers.id">
          <td>{{pers.vorname}}</td>
          <td>{{pers.nachname}}</td>
          <td>{{pers.email}}</td>
          <td>Dozent</td>
          <td></td>
        </tr>
      </table>
    </div>

    <!-- Student: Suchfeld der Kurse -->
    <div id="kurssuche" v-if="userRole=='Student'">
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button @click="getCoursebyName()">Suchen</button>
    </div>

    <!-- Dozent & Student: Kursansicht-->
    <div v-if="submittedAdd && submittedUpdate">
      <!-- Dozent: Add Button für Kurse -->
      <div v-if="userRole=='Dozent'">
        <button id="KursBtn" @click="addKurs()">Hinzufügen</button>
      </div>

      <!-- Dozent & Student: Kursliste -->
      <div class="courses-container" v-for="kurs in kurse" :key="kurs.id">
        <div>
            <router-link class="listItem" :to="{ name: 'courseStud', params:{ id: kurs.id}}">
            <strong >{{kurs.bezeichnung}}</strong>
          </router-link>
        </div>
        <div id="controls" v-if="userRole=='Dozent'">
          <img src="../assets/pen.png" alt="Edit" width="20" @click="update(kurs)" >&nbsp;
          <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(kurs.id, kurs.bezeichnung)">
        </div> 
      </div>
    </div>

    <!-- Dozent: Pop-up für die Kurserstellung -->
    <div v-if="!submittedAdd">
      <h3>Kurs hinzufügen</h3>
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="kurs.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="semester">Semester:</label><br>
        <input
          class="form-control"
          id="semester"
          required
          v-model="kurs.semester"
          name="semester"
        />
      </div>
      <button @click="saveKurs()" class="btn-success">Speichern</button>
      <button @click="cancel()" class="btn-success">Abbrechen</button>
    </div>

    <!-- Dozent: Pop-up für die Änderung -->
    <div v-if="!submittedUpdate">
      <h3>Kurs ändern</h3>
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="currentKurs.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="semester">Semester:</label><br>
        <input
          class="form-control"
          id="semester"
          required
          v-model="currentKurs.semester"
          name="semester"
        />
      </div>
      <button @click="updateKurs()" class="btn-success">Änderungen speichern</button>
      <button @click="cancel()" class="btn-success">Abbrechen</button>
    </div>
  </div>
</template>


<script>
import KursDataService from "../services/KursDataService";
import StudentDataService from "../services/StudentDataService";
import DozentDataService from "../services/DozentDataService";
export default {
    name: "HomeView",
    data() {
      return {
        studenten: [],
        dozenten: [],
        kurse: [],
        kurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        },
        currentKurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        },
        submittedAdd: true,
        submittedUpdate: true,
        user: null,
        userRole: null
      }
    },

    methods: {
      // Sucht Kurse nach Namen, Funktion der Studentensicht
      getCoursebyName(){
        console.log("Suche nach Kurs");
      },

      // Öffnet das Add-Pop-up Fenster 
      addUser(){
        console.log("Dozent: "+ JSON.stringify(this.dozenten, null, 4));
      },


      // Öffnet das Add-Pop-up Fenster 
      addKurs(){
        this.submittedAdd = false;
      },

      // Löscht einen Kurs nach ID
      deleteById(id, bezeichnung){
        KursDataService.delete(id);
        alert("Kurs "+ bezeichnung + " wurde gelöscht!");
        this.getAllCourses();
      },

      // Erzeugt einen neuen Kurs in der DB und schließt das Add-Pop-up
      saveKurs(){
        if(this.kurs.bezeichnung != "" && this.kurs.semester != ""){
          var data = {
            bezeichnung: this.kurs.bezeichnung,
            semester: this.kurs.semester
          };
          KursDataService.create(data)
            .then(response => {
              this.kurs.id = response.data.id;
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
          this.getAllCourses();
          this.flushKurs();
          console.log("Kurs speichern");
          this.submittedAdd = true;
        } else{
          alert("Bitte vervollständigen Sie das Formular!");
        }
      },

      // Setzt den ausgewählten Kurs und öffnent das Update-Pop-up
      update(kurs){
        this.currentKurs = kurs;
        this.submittedUpdate = false;
      },

      // Updatet den Kurs in der DB
      updateKurs(){
        KursDataService.update(this.currentKurs.id, this.currentKurs)
        .then(response => {
          console.log(response.data);
          this.message = 'The Course was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
        this.getAllCourses();
        this.submittedUpdate = true;
        alert("Kurs "+ this.currentKurs.bezeichnung + " wurde geändert!");

      },

      // Setzt den Kurs zurück
      flushKurs(){
        this.kurs.bezeichnung = "",
        this.kurs.semester = "",
        this.kurs.id = null
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.submittedAdd = true;
        this.submittedUpdate = true;
      },


      // Liefert alle Kurse aus der DB
      getAllCourses() {
      KursDataService.getAll()
        .then(response => {
          this.kurse = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      },

      // Funktion um das User-Objekt aus dem State (von Keycloak) zu setzen
      setUser() {
        console.log('It works');
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
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
      }
    },
    // Holt alle Kurse aus der Datenbank und setzt den User
    mounted() {
      this.getAllCourses();
      setTimeout(() => this.setUser(), 100);
      this.getStudenten();
      this.getDozenten();
    }
}
</script> 


<style scoped>

.master{
  margin-left: 40px;
}

#master_h3{
  margin-left: 0px;
}

.form-group{
  margin-left: 40px;
  margin-bottom: 20px;
}

.btn-success{
  margin-left: 40px;
}

#homeTitel{
  margin-left: 40px;
}

h2{
  margin-left: 40px;
}

h3{
  margin-left: 40px;
}

#KursBtn{
  margin-left: 40px;
}

.listItem{
  text-decoration: none;
  font-size: 24px;
}

#controls{
  margin-right: 800px;
}

img{
  cursor: pointer;
}

#query{
  margin-left: 40px;
}

.courses-container{
  margin-top: 40px;
  margin-left: 40px;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
}


</style>
