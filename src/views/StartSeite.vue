<template>
  <div class="container"> 
    <h2 v-if="userRole!='Master'">Meine Kurse</h2>
    
    <h4 id="warning" v-if="!profilDone" >Bitte vervollständigen Sie ihr Benutzerprofil!</h4>

    <!-- Master: Benutzerverwaltung -->
    <MasterControls v-if="userRole=='Master'"></MasterControls>


    <!-- Student: Suchfeld der Kurse -->
    <div id="kurssuche" v-if="userRole=='Student'">
      <input type="search" v-model="suchEingabe" id="query" placeholder="Kurs suchen...">
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
        <div class="courses-container"  v-for="k in kurse" :key="k.id">
          <div>
            <router-link class="listItem" :to="{ name: 'kurs', params:{ id: k.id}}">
              <strong >{{k.bezeichnung}}</strong>
            </router-link>
          </div>
          <div id="controls" v-if="userRole=='Dozent'">
            <img src="../assets/pen.png" alt="Edit" width="20" @click="update(k)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(k.id, k.bezeichnung)">
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
import StudentDataService from "@/services/StudentDataService";
import DozentDataService from "@/services/DozentDataService";

export default {
    name: "StartSeite",
    components: {
    PopupCourseControl,
    MasterControls
},
    data() {
      return {
        kurse: [],
        meineKurse: [],
        currentKurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        },
        submittedAdd: true,
        submittedUpdate: true,
        user: null,
        userRole: null,
        suchEingabe: "",
        profilDone: true
      }
    },

    methods: {
      // Sucht Kurse nach Namen, Funktion der Studentensicht
      getCoursebyName(){
        console.log(this.suchEingabe);
        KursDataService.findByBezeichnung(this.suchEingabe)
          .then(response => {
            this.kurse = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });        
        // this.suchEingabe = "";
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
        this.checkProfil();
      },

      // Student wird nach seiner Mail gesucht
      findStudByMail(){
        StudentDataService.findByEmail(this.user.email)
          .then(response => {
            let antwort = response.data[0];
            if(antwort){
              // save in Store
            } else {
              this.profilDone = false;
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      // Dozent wird nach seiner Mail gesucht 
      findDozByMail(){
        DozentDataService.findByEmail(this.user.email)
          .then(response => {
            let antwort = response.data[0];
            if(antwort){
              // save in Store
            } else {
              this.profilDone = false;
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      // Es wird überprüft ob ein Benutzer sein Profil bereits vervollständigt hat
      checkProfil(){
        if (this.userRole=="Student"){
          this.findStudByMail();
        } else {
          this.findDozByMail();
        }
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

#warning{
  color: red;
}

.courses-container{
  margin-top: 40px;
  /* margin-left: 40px; */
  text-decoration: none;
  display: flex;
  justify-content: space-between;
}

</style>
