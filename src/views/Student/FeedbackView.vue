<template>
  <div class="container" v-if="userRole=='Student'">
  <!-- Aus Demo-Zwecken wird die Antwort vorerst nur hochgeladen -->
    <div class="file-upload">
      <h2>Feedback</h2>
      <h3>Beispiel Feedback-Datei</h3>
      <input type="file" @change="handleFileUpload($event)" />
      <br><br>
      <button @click="xmlAuslesen()">Bestätigen</button>
    </div>
    <!-- Das Feedback wird nach Bewertungsaspekt ausgeben -->
    <div class="feedback">
      <div class="item1">
        <FeedbackDetails ref="aspekt1" index="0"></FeedbackDetails>
      </div>
      <div class="item2">
        <FeedbackDetails ref="aspekt2" index="1"></FeedbackDetails>
      </div>
      <div class="item3">
        <FeedbackDetails ref="aspekt3" index="2"></FeedbackDetails>
      </div>
      <div class="item4">
        <FeedbackDetails ref="aspekt4" index="3"></FeedbackDetails>
      </div>
    </div>
    <!-- Die Abgabe der Lösung ist nur möglich, wenn zu der Aufgabe bisher keine abgegeben wurde -->
    <button id="abgabeBtn" v-if="!loesungAbgegeben" @click="persistiereLoesung()">Lösung abgeben</button>
  </div>
</template>

<script>
// SFCs
import FeedbackDetails from '@/components/FeedbackDetails.vue';

// Services
import LoesungDataService from '@/services/LoesungDataService';
import BewertungsaspektDataService from '@/services/BewertungsaspektDataService';
import FeedbackDataService from '@/services/FeedbackDataService';

// Auskommentiert, solange die Bewertung über den Grader aSQLg noch nicht funktioniert
// import GraderService from '@/services/GraderService';



export default {
  name: "FeedbackView",
  props: ['response', 'aufgabenId'],
  components: {
    FeedbackDetails
  },
  data() {
    return {
      userRole: "",
      // XML-Datei
      file: '',
      // XML-Datei als String
      xmlString: "",
      // komplette ProFormA-Anwort als geparstes JSON-Objekt
      responseJSON: {},
      // Array mit den Bewertungsaspekten
      feedbackJSON: {},
      // Neues Array der Bewertungsaspekte
      bewertungsaspekte: [],
 
      loesungAbgegeben: false,
      loesungen: [],
      loesungsString: ""
    }
  },
  methods: {
    /**
       * Bei Auswahl einer Datei, wird diese lokal gesetzt
       * @param {object} event - Event wird beim Hochladen einer Datei getriggert
       */
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },

    /**
     * Die abgegbene Lösung eines Studenten wird gelesen und die setLoesungsString-Methode aufgerufen
     */
    readLoesung(){
      var reader = new FileReader();
      reader.readAsText(this.$store.state.loesung);
      // Die Slice Methode muss evtl. rausgenommen oder angepasst werden
      setTimeout(() => this.setLoesungsString(reader.result.slice(146)), 100);
    },

    /**
     * Der String der ausgelesenen Lösung wird lokal gesetzt
     * @param {string} loesungsString - Ergebnis des FileReaders
     */
    setLoesungsString(loesungsString){
      this.loesungsString = loesungsString;
    },

    /**
     * Das Feedback des Graders im XML-format wird gelesen
     * Anschließend wird das Ergebnis der Methode convertToJson() übergeben
     */
    xmlAuslesen() {
      var reader = new FileReader();
      reader.readAsText(this.file);
      setTimeout(() => this.convertToJson(reader.result), 100);
    },

    /**
     * Konvertiert die den XML-String des FileReaders in ein JSON-Objekt
     * anschließend wird die Methode neuesArrayGenerieren aufgerufen
     * @param {string} xmlString - Ergebnis des FileReaders
     */
    convertToJson(xmlString) {
      this.xmlString = xmlString;

      // Konvertiert XML-Datei ins JSON-Format
      var convert = require('xml-js');
      var response = convert.xml2json(this.xmlString, { compact: true, spaces: 2 });
      // Parst JSON
      this.responseJSON = JSON.parse(response);
      // wählt das Feedback aus der Datei aus
      this.feedbackJSON = this.responseJSON["response"]["separate-test-feedback"]["tests-response"]["test-response"];
      // Feedback auf der Konsole ausgeben
      this.neuesArrayGenerieren();
    },

    /**
     * Aus dem JSON-Objekt des Feedbacks wird ein neues Array erstellt
     * Das neue Array ist übersichtlicher und kann besser für die Darstellung 
     * in den Kind-Komponenten genutzt werden 
     */
    neuesArrayGenerieren() {
      // Für jeden Bewertungsaspekt soll ein Objekt im neuen Array angelegt werden
      for (let i = 0; i < this.feedbackJSON.length; i++) {
        let typ = this.feedbackJSON[i]._attributes.id;
        let punkte = this.feedbackJSON[i]["test-result"]["result"]["score"]["_text"];
        let anmerkungen = this.feedbackJSON[i]["test-result"]["feedback-list"];

        const bewertungsaspekt = {
          "id": i + 1,
          "typ": typ,
          "punkte": punkte,
          "anmerkungen": []
        };

        // Anzahl der Anmerkungen
        let length = Object.keys(anmerkungen["student-feedback"]).length;

        // Eine Anmerkung wird dem Bewertungsaspekt hinzugefügt
        if (length == 3) {
          let anmerkung = {
              "id": 1,
              "anmerkung": anmerkungen["student-feedback"]["content"]["_text"]
          };
          bewertungsaspekt.anmerkungen[0] = anmerkung;
        } else {
        // Mehrere Anmerkungen werden dem Bewertungsaspekt hinzugefügt
          for (let j = 0; j < length; j++) {
            let anmerkung = {
              "id": j + 1,
              "anmerkung": anmerkungen["student-feedback"][j]["content"]["_text"]
            };
            bewertungsaspekt.anmerkungen[j] = anmerkung;
          }
        }
        // Bewertungsapsekt wird dem neuen Array "bewertungsaspekte" hinzugefügt
        this.bewertungsaspekte[i] = bewertungsaspekt;
      }
      // Den Kind-Komponenten wird über ein Boolean mitgeteilt, dass das neue Array fertig erstellt ist
      this.$refs.aspekt1.feedbackReady = true;
      this.$refs.aspekt2.feedbackReady = true;
      this.$refs.aspekt3.feedbackReady = true;
      this.$refs.aspekt4.feedbackReady = true;
    },

    /**
     * Wenn die Lösung final eingereicht werden soll,
     * wird zuerst die Lösung persistiert. Hier wird ein Objekt für die
     * Lösung angelegt, welches in der Datenbank gespeichert wird. 
     * Nach dem erfolgreichen Anlegen der Lösung wird die Methode
     * persistiereBewertungsaspekte aufgerufen
     */
    persistiereLoesung() {
      var aufgabenIdString = this.aufgabenId.toString();
      var nachnameStud = this.$store.state.student.nachname;
      var bezeichnung = "aufgabe_" + aufgabenIdString + "_" + nachnameStud;
      var punkte_erreicht = 0;
      
      for(let i=0; i< this.bewertungsaspekte.length; i++){
        punkte_erreicht += Number(this.bewertungsaspekte[i].punkte);
      }

      const loesung = {
        "bezeichnung": bezeichnung,
        "punkte": punkte_erreicht,
        "loesung": this.loesungsString,
        "aufgabeId": Number(this.aufgabenId),
        "studentId": this.$store.state.student.id
      };

      LoesungDataService.create(loesung)
        .then(res =>{
          this.persistiereBewertungsaspekte(res.data.id);
        })
        .catch(e => {
          console.log("Lösung: " + e);
        })      
    },

    /**
     * @param {number} loesungsId - Id der neu angelegten Lösung
     * Es werden Bewertungsaspekt-Objekte angelegt und in der Datenbank
     * gespeichert. Die loesungsId ist ein Attribut der Bewertungsaspekt-Objekte.
     * Somit entsteht in der Datenbank eine Beziehung zwischen der Lösung und den Bewertungsapsekten.
     * Bei erfolgreicher Anlegung eines Bewertungsaspektes wird die Methode persistiereAnmerkungen aufgerufen.
     */
    persistiereBewertungsaspekte(loesungsId){
      for(let i=0; i< this.bewertungsaspekte.length; i++){
        const bewertungsaspekt = {
          "typ": this.bewertungsaspekte[i].typ,
          "punkte": this.bewertungsaspekte[i].punkte,
          "loesungId": loesungsId
        };

        var aspektId = null;
        BewertungsaspektDataService.create(bewertungsaspekt)
          .then(res => {
            console.log(JSON.stringify(res.data,null,2));
            aspektId = res.data.id;
            this.persistiereAnmerkungen(i, aspektId);
          })
          .catch(e => {
            console.log("Aspekt: " + e);
          })
      }
    },
  
    /**
     * Persistiert die Anmerkungen der Bewertungsaspekte
     * @param {number} index - Index des zugehörigen Bewertungsaspektes im neuen Array
     * @param {number} aspektId - Id des zugehörigen Bewertungsaspektes
     */
    persistiereAnmerkungen(index, aspektId){
      for(let j=0; j< this.bewertungsaspekte[index].anmerkungen.length; j++){
        const feedback = {
          "anmerkung": this.bewertungsaspekte[index].anmerkungen[j].anmerkung,
          "bewertungsaspektId": aspektId
        }
        FeedbackDataService.create(feedback)
          .catch(e => {
            console.log("Feedback: " + e);
          })
      }
      this.loesungAbgegeben = true;
    },

    /**
     * Überprüft ob es in allen Lösungen eine gibt, die dem
     * Studenten und dieser Aufgabe zuzuordnen ist.
     * Ist, dass der Fall, wird ein Bool-Wert gesetzt, der 
     * den Abgabe-button ausblendet.
     */
    checkForAbgabe(){
      var studentId =  this.$store.state.student.id;

      LoesungDataService.getAll()
        .then(res =>{
          this.loesungen = res.data;
          for(let i=0; i<this.loesungen.length; i++){
            if(this.loesungen[i].aufgabeId == this.aufgabenId && this.loesungen[i].studentId == studentId) {
              this.loesungAbgegeben = true;
            } 
          } 
        })
        .catch(e =>{
          console.log(e);
        })
    },
      
    /**
     * Fragt dem Grader nach dem Feedback, mit der übergebenen gradeProcessId, ab.
     * Anschließend wird das Feedback ausgelesen
     */
    //   getGraderFeedback(){
    //     GraderService.get(this.response.gradeProcessId)
    //       .then(res => {
    //         this.file = res.data;
    //         this.feedbackAuslesen();
    //       })
    //       .catch(e => {
    //         console.log(e);
    //       })
    //   }    
    
    



  },
  /**
   * Beim Aufruf der Seite wird, wenn die Bewertung funktioniert, das Feedback vom Grader abgeholt.
   * Danach wird überpüft ob bereits eine Lösung abgegeben wurde. Zuletzt wird die Lösung des Studenten
   * gelesen und lokal gesetzt. 
   */
  mounted(){
    // setTimeout(this.getGraderFeedback(), Number(this.response.estimatedSecondsRemaining))*1000;
    this.userRole = this.$store.state.user.realm_access.roles[0];
    this.checkForAbgabe();
    this.readLoesung();
  }
}

</script>

<style scoped>
.feedback {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  height: 100%;
}

#abgabeBtn{
  margin-top: 20px;
}
</style>