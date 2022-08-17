<template>
  <div class="container"> 
    <!-- Titel für Dozenten und Studenten -->
    <h2 v-if="userRole!='Master'">Meine Kurse</h2>
    
    <!-- Warnmeldung, wenn Benutzer ihr Profil noch nicht vervollständigt haben -->
    <h4 id="warning" v-if="!profilDone && userRole!='Master'">Bitte vervollständigen Sie ihr Benutzerprofil!</h4>

    <!-- Master: Benutzerverwaltung -->
    <MasterControls v-if="userRole=='Master'"></MasterControls>


    <!-- Student: Suchfeld der Kurse -->
    <div id="kurssuche" v-if="profilDone && userRole=='Student'">
      <input type="search" v-model="suchEingabe" id="query" placeholder="Kurs suchen...">
      <button class="btn" @click="getCoursebyName()">Suchen</button>
      <button class="btn" @click="refresh()">Refresh</button>
    </div>

    <!-- Dozent & Student: Kursansicht-->
    <div v-if="profilDone && submittedAdd && submittedUpdate && submittedDelete">
      <!-- Dozent: Add Button für Kurse -->
      <div v-if="userRole=='Dozent'">
        <button id="KursBtn" @click="addKurs()">Hinzufügen</button>
        <button class="btn" @click="refresh()">Refresh</button>
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
          <!-- Dozent: Icons zum Löschen und Ändern von Kursen -->
          <div class="controls" v-if="userRole=='Dozent'">
            <img src="../assets/pen.png" alt="Edit" width="20" @click="update(k)" >&nbsp;
            <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteCourse(k)">
          </div> 
        </div>
      </div>
    </div>
    <!-- Dozent: Popup für die Kurs Kontrolle -->
    <PopupCourseControl v-if="userRole=='Dozent'"></PopupCourseControl>
    <PopupDeleteCourse v-if="!submittedDelete"></PopupDeleteCourse>
  </div>
</template>


<script>

// Single File Components
import PopupCourseControl from "@/components/PopupCourseControl.vue";
import PopupDeleteCourse from "@/components/PopupDeleteCourse.vue";
import MasterControls from "@/components/MasterControls.vue";




// Services
import KursDataService from "../services/KursDataService";
import StudentDataService from "@/services/StudentDataService";
import DozentDataService from "@/services/DozentDataService";

export default {
    name: "StartSeite",
    components: {
    PopupCourseControl,
    MasterControls,
    PopupDeleteCourse
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
        submittedDelete: true,
        user: null,
        userRole: null,
        suchEingabe: "",
        profilDone: true,
        search: false
      }
    },

    methods: {
      
      /**
       * Sucht Kurse nach vorgegebener Bezeichnung
       * Funktion der Studentensicht
       */
      getCoursebyName(){
        if(this.suchEingabe){
          KursDataService.findByBezeichnung(this.suchEingabe)
            .then(response => {
              this.search = true;
              this.kurse = response.data;
            })
            .catch(e => {
              console.log(e);
            });        
          this.suchEingabe = "";
        } else {
          alert("Bitte Kurs eingeben!");
        }
      },

      /**
       * blendet die Übersicht der gefundenen Kurse aus
       */
      ausblenden(){
        this.search = false;
      },

      /**
       * Der angemeldete Student schreibt sich in einem Kurs ein
       * @param {number} kursId - Id des Kurses in der sich eingeschrieben wird 
       */
      einschreiben(kursId){
        const studentId = {
          "studentId":  this.$store.state.student.id
        };
        KursDataService.addStudent(kursId, studentId)
          .catch(e => {
            console.log(e);
          })
        this.refresh();
        this.search = false;
      },
     
      // Öffnet das Pop-up Fenster zum Hinzufügen eines Kurses
      addKurs(){
        this.submittedAdd = false;
      },

      /**
       * Öffnet das Popup-Fenster zum Löschen eines Kurses 
       * @param {object} kurs - Das zu löschende Kurs-Objekt wird als aktueller Kurs gesetzt
       * Über das aktuelle Kurs-objekt, kann das Popup-SFC auf die Daten zugreifen 
       */ 
      deleteCourse(kurs){
        this.currentKurs = kurs;
        this.submittedDelete = false;
      },

      
      /**
       * Setzt den ausgewählten Kurs und öffnent das Update-Popup
       * @param {object} kurs - Das zu löschende Kurs-Objekt wird als aktueller Kurs gesetzt
       */
      update(kurs){
        this.currentKurs = kurs;
        this.submittedUpdate = false;
      },

      
      /**
       * Das User-Objekt aus dem State (Keycloak-Access token) wird genutzt um 
       * den Benutzer und seine Rolle lokal zu speichern.
       */
      setUser() {
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
        this.refresh();
      },

      
      /**
       * Student wird nach seiner Mail gesucht
       * Das Ergebnis wird im globalen Speicher (state) gespeichert
       * Existiert zu gegebener Mail kein Benutzer in der Datenbank
       * wird der boolean-Wert profilDone auf falsch gesetzt.
       */
      findStudByMail(){
        StudentDataService.findByEmail(this.user.email)
          .then(response => {
            let antwort = response.data[0];
            if(antwort){
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
      
       /**
       * Dozent wird nach seiner Mail gesucht
       * Das Ergebnis wird im globalen Speicher (state) gespeichert
       * Existiert zu gegebener Mail kein Benutzer in der Datenbank
       * wird der boolean-Wert profilDone auf falsch gesetzt.
       */
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

    
      /**
       * Es wird überprüft ob ein Benutzer sein Profil bereits vervollständigt hat
       */
      checkProfil(){
        if (this.userRole=="Student"){
          this.findStudByMail();
        } else {
          this.findDozByMail();
        }
      },

      
      /**
       * Holt die Kurse des Benutzers aus dem globalen Speicher
       */
      getMeineKurse(){
        if(this.userRole=="Student"){
          this.meineKurse = this.$store.state.student.kurs;
        } else {
          this.meineKurse = this.$store.state.dozent.kurs;
        }
      },

      /**
       * holt die Kurse neu aus der Datenbank und speichert diese lokal neu ab
       */
      refresh(){
        this.checkProfil();
        setTimeout(() => this.getMeineKurse(), 100);
      }

    },
    /**
     * beim Aufruf der Startseite wird nach einer Verzögerung von einer Zehntel-Sekunde
     * die Methode setUser() aufgerufen 
     */
    mounted() {
      setTimeout(() => this.setUser(), 100);
    },
    /**
     * Ein Beobachter für die lokale Variable meineKurse
     * Wenn die Variable geändert wird, wird die Methode getMeineKurse() aufgerufen
     */
    watch: {
      meineKurse(){
        this.getMeineKurse();
      }
    }
}
</script> 


<style scoped>

.container{
  margin-left: 40px;
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
  text-decoration: none;
  display: flex;
  justify-content: space-between;
}

.searchKurse{
  margin-top: 20px;
}

.btn{
  margin-left: 10px;
}

</style>
