<template>
  <div> 
    <h2 id="homeTitel">Meine Kurse</h2>

    <!-- Suchfeld der Kurse für Studenten -->
    <div id="kurssuche" v-if="userRole=='Student'">
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button @click="getCoursebyName()">Suchen</button>
    </div>

    <!-- Wird angezeigt, wenn kein neuer Kurs hinzugefügt wird -->
    <div v-if="submittedAdd">
      <!-- Add Button für Kurse der Dozenten -->
      <div v-if="userRole=='Dozent'">
        <button id="KursBtn" @click="addKurs()">Hinzufügen</button>
      </div>

      <!-- Kursliste für beide Rollen -->
      <div class="courses-container" v-for="kurs in kurse" :key="kurs.id">
        <div>
            <router-link class="listItem" :to="{ name: 'courseStud', params:{ id: kurs.id}}">
            <strong >{{kurs.bezeichnung}}</strong>
          </router-link>
        </div>
        <div id="controls">
          <img src="../assets/pen.png" alt="Edit" width="20" @click="update(kurs)" >&nbsp;
          <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(kurs.id, kurs.bezeichnung)">
        </div> 
      </div>
    </div>

    <!-- Pop-up für die Kurserstellung -->
    <div v-if="!submittedAdd">
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

    <!-- Pop-up für die Änderung -->
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
export default {
    name: "HomeView",
    data() {
      return {
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

      update(kurs){
        this.currentKurs = kurs;
        this.submittedUpdate = false;
      },


      updateKurs(){
        KursDataService.update(this.currentKurs.id, this.currentKurs)
        .then(response => {
          console.log(response.data);
          this.message = 'The tutorial was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
        this.getAllCourses();
      },

      flushKurs(){
        this.kurs.bezeichnung = "",
        this.kurs.semester = "",
        this.kurs.id = null
      },

      cancel(){
        this.submittedAdd = true;
        this.submittedUpdate = true;
      },

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

      setUser() {
        console.log('It works');
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
    }
    },
    mounted() {
    this.getAllCourses();
    setTimeout(() => this.setUser(), 100);
  }
}
</script> 


<style scoped>


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
