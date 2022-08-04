<template>
  <div class="container"> 
    <h2 v-if="userRole!='Master'">Meine Kurse</h2>

    <!-- Master: Benutzerverwaltung -->
    <MasterControls v-if="userRole=='Master'"></MasterControls>


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
      <div v-if="userRole!='Master'">
        <div class="courses-container"  v-for="kurs in kurse" :key="kurs.id">
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
    </div>


    <!-- Dozent: Popup für die Kurs Kontrolle -->
    <PopupCourseControl/>

  </div>
</template>


<script>

// Components
import PopupCourseControl from "@/components/PopupCourseControl.vue";
import MasterControls from "@/components/MasterControls.vue";



// Services
import KursDataService from "../services/KursDataService";

// import GraderService from "@/services/GraderService";

export default {
    name: "HomeView",
    components: {
    PopupCourseControl,
    MasterControls
},
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
        userRole: null,
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

      // Setzt den ausgewählten Kurs und öffnent das Update-Pop-up
      update(kurs){
        this.currentKurs = kurs;
        this.submittedUpdate = false;
      },

      // Liefert alle Kurse aus der DB
      getAllCourses() {
      KursDataService.getAll()
        .then(response => {
          this.kurse = response.data;
          // console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      },

      // Funktion um das User-Objekt aus dem State (von Keycloak) zu setzen
      setUser() {
        console.log("User set");
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
      },

    },
    // Holt alle Kurse aus der Datenbank und setzt den User
    mounted() {
      this.getAllCourses();
      setTimeout(() => this.setUser(), 100);
    }
}
</script> 


<style scoped>

.container{
  margin-left: 40px;
}

#master_h3{
  margin-left: 0px;
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


.courses-container{
  margin-top: 40px;
  margin-left: 40px;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
}

</style>
