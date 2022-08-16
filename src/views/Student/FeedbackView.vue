<template>
  <div class="container" v-if="userRole=='Student'">
    <div class="file-upload">
      <h2>Feedback</h2>
      <h3>Beispiel Feedback-Datei</h3>
      <input type="file" @change="handleFileUpload($event)" />
      <br><br>
      <button @click="xmlAuslesen()">Bestätigen</button>
    </div>
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
    <button id="abgabeBtn" v-if="!loesungAbgegeben" @click="persistiereLoesung()">Lösung abgeben</button>
    <button id="abgabeBtn" @click="test()">Lösung anzeigen</button>
  </div>
</template>

<script>
import FeedbackDetails from '@/components/FeedbackDetails.vue';

import LoesungDataService from '@/services/LoesungDataService';
import BewertungsaspektDataService from '@/services/BewertungsaspektDataService';
import FeedbackDataService from '@/services/FeedbackDataService';


// import GraderService from '@/services/GraderService';



export default {
  name: "FeedbackView",
  props: ['response', 'aufgabenId', 'loesung'],
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
      loesungen: []
    }
  },
  methods: {

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },

    test(){
      var reader = new FileReader();
      console.log(this.loesung);
      console.log(this.loesung.type);
      console.log(this.loesung.name);
      reader.readAsText(this.loesung);
      setTimeout(() => console.log(reader.result), 100);
    },

    xmlAuslesen() {
      var reader = new FileReader();
      reader.readAsText(this.file);
      setTimeout(() => this.convertToJson(reader.result), 100);
    },

    convertToJson(result) {
      this.xmlString = result;

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

        // let arrayAnmerkungen = [];

        let length = Object.keys(anmerkungen["student-feedback"]).length;
        if (length == 3) {
          let anmerkung = {
              "id": 1,
              "anmerkung": anmerkungen["student-feedback"]["content"]["_text"]
          };
          bewertungsaspekt.anmerkungen[0] = anmerkung;
        } else {
          for (let j = 0; j < length; j++) {
            let anmerkung = {
              "id": j + 1,
              "anmerkung": anmerkungen["student-feedback"][j]["content"]["_text"]
            };
            bewertungsaspekt.anmerkungen[j] = anmerkung;
          }
        }
        this.bewertungsaspekte[i] = bewertungsaspekt;
      }
      // console.log("Neues Array: " + JSON.stringify(this.bewertungsaspekte, null, 2));
      this.$refs.aspekt1.feedbackReady = true;
      this.$refs.aspekt2.feedbackReady = true;
      this.$refs.aspekt3.feedbackReady = true;
      this.$refs.aspekt4.feedbackReady = true;
    },

    // Die Lösung wird persistiert
    persistiereLoesung() {

      var loesungsString = this.responseJSON["response"]["separate-test-feedback"]["submission-feedback-list"]["student-feedback"][1]["content"]["_cdata"];


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
        "loesung": loesungsString,
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

    persistiereBewertungsaspekte(loesungsId){

      for(let i=0; i< this.bewertungsaspekte.length; i++){
        const bewertungsaspekt = {
          "typ": this.bewertungsaspekte[i].typ,
          "punkte": this.bewertungsaspekte[i].punkte,
          "loesungId": loesungsId
        };

        // console.log(JSON.stringify(bewertungsaspekt,null,2));

        var aspektId = null;

        BewertungsaspektDataService.create(bewertungsaspekt)
          .then(res => {
            console.log(JSON.stringify(res.data,null,2));
            aspektId = res.data.id;
            // console.log("AspektId 1: "+aspektId);
            this.persistiereAnmerkungen(i, aspektId);
          })
          .catch(e => {
            console.log("Aspekt: " + e);
          })

      }
    },
  
    persistiereAnmerkungen(index, aspektId){

      for(let j=0; j< this.bewertungsaspekte[index].anmerkungen.length; j++){
        const feedback = {
          "anmerkung": this.bewertungsaspekte[index].anmerkungen[j].anmerkung,
          "bewertungsaspektId": aspektId
        }
        // console.log(JSON.stringify(feedback,null,2));
        FeedbackDataService.create(feedback)
          .catch(e => {
            console.log("Feedback: " + e);
          })
      }
      this.loesungAbgegeben = true;
    },

    checkForAbgabe(){
      // var aufgabenId = Number(this.aufgabenId);
      var studentId =  this.$store.state.student.id;

      LoesungDataService.getAll()
        .then(res =>{
          this.loesungen = res.data;
          for(let i=0; i<this.loesungen.length; i++){
            if(this.loesungen[i].aufgabeId == this.aufgabenId && this.loesungen[i].studentId == studentId) {
              // console.log(JSON.stringify(this.loesungen[i],null,2));
              this.loesungAbgegeben = true;
            } 
          } 
        })
        .catch(e =>{
          console.log(e);
        })
    }
      

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
  mounted(){
    //   this.getGraderFeedback();
    this.userRole = this.$store.state.user.realm_access.roles[0];
    this.checkForAbgabe();
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