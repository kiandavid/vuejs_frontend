<template>
  <div class="container"> 
    <h2 v-if="userRole!='Master'">Meine Kurse</h2>
    
    <h4 id="warning" v-if="!profilDone && userRole!='Master'">Bitte vervollständigen Sie ihr Benutzerprofil!</h4>

    <!-- Master: Benutzerverwaltung -->
    <MasterControls v-if="userRole=='Master'"></MasterControls>


    <!-- Student: Suchfeld der Kurse -->
    <div id="kurssuche" v-if="profilDone && userRole=='Student'">
      <input type="search" v-model="suchEingabe" id="query" placeholder="Kurs suchen...">
      <button @click="getCoursebyName()">Suchen</button>
    </div>

    <!-- Dozent & Student: Kursansicht-->
    <div v-if="profilDone && submittedAdd && submittedUpdate">
      <!-- Dozent: Add Button für Kurse -->
      <div v-if="userRole=='Dozent'">
        <button id="KursBtn" @click="addKurs()">Hinzufügen</button>
      </div>

      <!--Student: Ergebnisiste der Kurse nach Suche -->
      <div v-if="userRole=='Student' && search" class="searchKurse">
        <button @click="ausblenden()" >Ausblenden</button>
        <div class="courses-container"  v-for="k in kurse" :key="k.id">
          <div>
            <strong >{{k.bezeichnung}}</strong>
          </div>
          <div class="controls">
            <button @click="einschreiben(k.id)" >Einschreiben</button>
          </div>
        </div>
        <hr>
      </div>

      <!-- Dozent & Student: Kursliste -->
      <div v-if="userRole!='Master'">
        <div class="courses-container"  v-for="k in meineKurse" :key="k.id">
          <div>
            <router-link class="listItem" :to="{ name: 'kurs', params:{ id: k.id }}">
              <strong >{{k.bezeichnung}}</strong>
            </router-link>
          </div>
          <div class="controls" v-if="userRole=='Dozent'">
            <img src="../assets/pen.png" alt="Edit" width="20" @click="update(k)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteById(k.id, k.bezeichnung)">
          </div> 
        </div>
      </div>
    </div>
    <!-- Dozent: Popup für die Kurs Kontrolle -->
    <PopupCourseControl v-if="userRole=='Dozent'"></PopupCourseControl>

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
        profilDone: true,
        search: false
      }
    },

    methods: {
      // Sucht Kurse nach Namen, Funktion der Studentensicht
      getCoursebyName(){
        if(this.suchEingabe){
          KursDataService.findByBezeichnung(this.suchEingabe)
            .then(response => {
              this.search = true;
              this.kurse = response.data;
              // console.log(this.kurse);
            })
            .catch(e => {
              console.log(e);
            });        
          this.suchEingabe = "";
        } else {
          alert("Bitte Kurs eingeben!");
        }
      },

      ausblenden(){
        this.search = false;
      },

      einschreiben(id){
        const studentId = {
          "studentId":  this.$store.state.student.id
        };
        KursDataService.addStudent(id, studentId)
          .catch(e => {
            console.log(e);
          })
        this.meineKurse = null;
        this.search = false;
      },
     
      // Öffnet das Add-Pop-up Fenster 
      addKurs(){
        this.submittedAdd = false;
      },

      // Löscht einen Kurs nach ID
      deleteById(id, bezeichnung){
        KursDataService.delete(id, 0);
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
              this.meineKurse = antwort.kurs;
              // save in Store
              this.$store.dispatch('setStudent', antwort);
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
            this.$store.dispatch('setDozent', antwort);
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
          // console.log("Student: "+ JSON.stringify( this.$store.state.student,null,2));
        } else {
          this.findDozByMail();
          // console.log("Dozent: "+ JSON.stringify( this.$store.state.dozent,null,2));
        }
      },
    },
    // Holt alle Kurse aus der Datenbank und setzt den User
    mounted() {
      // this.getAllCourses();
      setTimeout(() => this.setUser(), 100);
    },
    watch: {
      meineKurse(){
        this.findStudByMail();
      }
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

.controls{
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

.searchKurse{
  margin-top: 20px;
}

</style>
