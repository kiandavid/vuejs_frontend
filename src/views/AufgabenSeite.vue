<template>
  <div class="excercise-container">
    <!-- Titel der Aufgabe -->
    <h2>{{aufgabe.bezeichnung}}</h2>

    <!-- Aufgabenstellung (Aufgabendatei, kann noch nicht geöffnet werden) -->
    <strong id="aufgabe">Aufgabenstellung:</strong><br><br>
    <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</span><br><br>


    <!-- Aufgabenübersicht des Dozenten -->
    <table id="tabelleAufgabe" v-if="userRole=='Dozent' && dataReady">
      <tr>
        <th>Student</th>
        <th>Matrikelnummer</th>
        <th>Status</th>
        <th>Erreichte Punkte</th>
      </tr>
      <tr class="teilnehmer-container" v-for="pers in studenten" :key="pers.id">
        <td>{{pers.vorname}} {{pers.nachname}}</td>
        <td>{{pers.matrikelnummer}}</td>
        <td>{{getStatus(pers.id)}}</td>
        <td>{{getPunkte(pers.id)}} / {{punkte_max}}</td>
      </tr>
    </table>

    <!-- Aufgabenübersicht der Studenten -->
    <div v-if="userRole=='Student' && dataReady">
      <table id="AufgabenDetails">
          <tr>
            <th>Status</th>
            <td>{{getStatus(this.$store.state.student.id)}}</td>
          </tr>
          <tr>
            <th>Punkte</th>
            <td>{{getPunkte(this.$store.state.student.id)}} / {{aufgabe.punkte_max}}.0</td>
          </tr>
          <tr>
            <th>Bewertung</th>
            <td>{{getBewertung(this.$store.state.student.id)}}</td>
          </tr>
      </table>

      <!-- Student: Einrechen der Lösung -->
      <h3>Lösung einreichen</h3>
      <input type="file" @change="handleFileUpload( $event )"/>
      <br><br>
      <button @click="reicheLösungEin()">Lösung einreichen</button>
      
      <br><br><br><br>
      <!-- Student: Link zur Feedbackseite -->
      <router-link class="routerlink" :to="{ name: 'FeedbackStud', params:{ response: responseData, aufgabenId: this.id}}">Feedback einsehen</router-link>
    </div>
  </div>
</template>



<script>
// Services
import AufgabeDataService from '@/services/AufgabeDataService';
import KursDataService from '@/services/KursDataService';
import LoesungDataService from '@/services/LoesungDataService';

// import AufgabeDataService2 from '@/services/AufgabeDataService2';


export default {
  name: 'AufgabenSeite',
  props: [
    'id',
    'bezeichnung',
    'kursId'
  ],
  data() {
    return {
      studenten: [],
      user: null,
      userRole: "",
      file: "",
      submissionXML: "",
      responseData: {},
      aufgabe: {},
      status: "Nicht abgegeben",
      punkte: "-",
      punkte_max: null,
      bewertung: "0.0%",
      loesungen: [],
      dataReady: false
    }
  },
  methods: {
      /**
       * Das User-Objekt aus dem State (Keycloak-Access token) wird genutzt um 
       * den Benutzer und seine Rolle lokal zu speichern.
       */
      setUser() {
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
      },

      /**
       * Holt die Aufgabe aus der Datenbank
       * @param {number} aufgabenId - Id der Aufgabe
       */
      getAufgabe(aufgabenId){
        AufgabeDataService.get(aufgabenId)
          .then(response => {
            this.aufgabe = response.data;
            this.punkte_max = response.data.punkte_max;
          })
          .catch(e => {
            console.log(e);
          })
      },

      // Holt die Kursdaten mit den dazugehörigen Aufgaben des Kurses
      /**
       * Holt die Studenten eines Kurses aus der Datenbank
       * @param {number} kursId - Id des Kurses in dem die Studenten sind
       */
      getStudenten(kursId){
        KursDataService.get(kursId)
          .then(response => {
              this.studenten = response.data.students;
          })
          .catch(e => {
            console.log(e);
          });
      },      

      /**
       * Gibt den Status der Abgabe einer Aufgabe zurück
       * @param {number} studentId - Id des Studenten
       * @return {string} status - Entweder "Nicht abgegeben" | "Abgegeben"
       */
      getStatus(studentId){
        var status = "Nicht Abgegeben";
        for(let j=0; j < this.loesungen.length; j++){
          if(this.loesungen[j].aufgabeId == this.aufgabe.id && this.loesungen[j].studentId == studentId) {
                status = "Abgegeben";
              }               
            }
        return status;
      },

      /**
       * Gibt die erreichte Punktzahl der Abgabe zurück
       * @param {number} studentId - Id des Studenten
       * @return {number} punkte - Auf zwei Nachkommastellen gerundet
       */
      getPunkte(studentId){
        var punkte = 0;
        for(let j=0; j < this.loesungen.length; j++){
          if(this.loesungen[j].aufgabeId == this.aufgabe.id && this.loesungen[j].studentId == studentId) {
                var temp = Math.round(this.loesungen[j].punkte*100);
                punkte = temp/100;
              }               
            }
        return punkte;        
      },

      /**
       * Gibt die Bewertung der Abgabe zurück
       * @param {number} studentId - Id des Studenten
       * @return {string} bewertung - Prozentsatz: Erreichte Punkte / Maximal erreichbare Punkte
       */
      getBewertung(id){
        let bewertung = Math.round((this.getPunkte(id) / this.aufgabe.punkte_max)*100);
        return bewertung+'%';
      },
      
      // Holt Alle Lösungen aus der Datenbank
      getAllLoesungen(){
        LoesungDataService.getAll()
          .then(res =>{
            this.loesungen = res.data;
            this.dataReady = true;
          })
          .catch(e => {
            console.log(e);
          })      
      },      

      /**
       * Bei Auswahl einer Datei, wird diese lokal gesetzt
       * @param {object} event - Event wird beim Hochladen einer Datei getriggert
       */
      handleFileUpload( event ){
				this.file = event.target.files[0];
			},

    
			/**
       * Erstellt aus der abgegeben Lösung eine Zip-Datei
       * Die Datei submission.xml und die Aufgabendatei "task.zip",
       * können über den AufgabenDataService2 von Node.js geholt werden
       * Die Dateien werden im Binärformat zurückgeschickt und müssen noch
       * angepasst werden. 
       */
			reicheLösungEin(){
        // Lösung wird im state gespeichert
        this.$store.dispatch('setLoesung', this.file);

        var JSZip = require("jszip");
        var zip = new JSZip();

        // submission.xml muss unter dem Pfad im Node.js-Verzeichnis zu finden sein
        // Die zurückgebene Datei muss noch ins XML-Format übertragen werden
        AufgabeDataService2.get("Aufgaben\\submission.xml")
           .then(res => {
             this.submissionXML = res.data; 
           })

        // Submission.xml wird hier hinzugefügt 
        zip.file("submission.xml", this.submissionXML);

        // Es werden Ordner für die Aufgabe und Abgabe angelegt
        var task = zip.folder("task");
        var submission = zip.folder("submission");
    
        // Die zurückgebene Datei ist im Binärformat und muss umgewandelt werden
        var taskFile;
        AufgabeDataService2.get(this.aufgabe.aufgabe)
           .then(res => {
             taskFile = res.data; 
           })
          
        // Aufgabe -und Abgabedateien werden in ihre Ordner eingefügt
        task.file("task.zip", taskFile, {base64: true});
        submission.file("submission.sql", this.file, {base64: true});

        // ZIP-Datei wird erstellt und dem Grader-Service als Submission angehängt
        zip.generateAsync({type:"blob"})
          .then(function(content) {
            GraderService.submit(content)
             .then(response => {
              this.responseData = response.data;
            })
            .catch(e => {
              console.log("Fehler: " + e);
            });
          });
      }

    },


    // Holt alle Kurse aus der Datenbank und setzt den User
    /**
     * Beim Aufruf der Seite wird der/die Benutzer(-rolle) aus dem state geholt
     * Die Aufgabe, die Studenten und die Lösungen werden aus der Datenbank geholt
     */
    mounted() {
      this.setUser();
      this.getAufgabe(this.id);
      this.getStudenten(this.kursId);
      this.getAllLoesungen();
    }
  
}
</script> 


<style scoped>

#aufgabe{
  text-decoration: underline;
}

#tabelleAufgabe{
  margin-left: 0px;
}

.excercise-container{
  margin-left: 40px;
}

h2{
  margin-left: 0px;
}
.routerlink {
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>


