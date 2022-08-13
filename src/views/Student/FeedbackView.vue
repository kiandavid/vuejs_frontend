<template>
  <div class="container">
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
  </div>
</template>

<script>
import FeedbackDetails from '@/components/FeedbackDetails.vue';

import LoesungDataService from '@/services/LoesungDataService';
// import BewertungsaspektDataService from '@/services/BewertungsaspektDataService';
// import FeedbackDataService from '@/services/FeedbackDataService';

// import GraderService from '@/services/GraderService';



export default {
  name: "FeedbackView",
  props: ['response', 'aufgabenId'],
  components: {
    FeedbackDetails
  },
  data() {
    return {
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
      // Id der Loesung
      loesungsId: null
    }
  },
  methods: {

    handleFileUpload(event) {
      this.file = event.target.files[0];
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
        // console.log("Der Bewertungsaspekt "+ typ + " bringt "+ punkte + " Punkt(e)!");
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
      this.persistiereLoesung();
    },

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
          this.loesungsId = res.data.id;
          console.log("1 " + this.loesungsId);
          this.persistiereBewertungsaspekte();
        })
        .catch(e => {
          console.log("Lösung: " + e);
        })      
    },

    persistiereBewertungsaspekte(){

      console.log("2 " + this.loesungsId);


      for(let i=0; i< this.bewertungsaspekte.length; i++){
        const bewertungsaspekt = {
          "typ": this.bewertungsaspekte[i].typ,
          "punkte": this.bewertungsaspekte[i].punkte,
          "loesungId": this.loesungsId
        };

        console.log(JSON.stringify(bewertungsaspekt,null,2));

      //   var aspektId = null;

      //   BewertungsaspektDataService.create(bewertungsaspekt)
      //     .then(res => {
      //       console.log(JSON.stringify(res.data,null,2));
      //       aspektId = res.data.id;
      //     })
      //     .catch(e => {
      //       console.log("Aspekt: " + e);
      //     })

      //   console.log("AspektId: "+aspektId);


        // for(let j=0; j< this.bewertungsaspekte[i].anmerkungen.length; j++){
        //   const feedback = {
        //     "anmerkung": this.bewertungsaspekte[i].anmerkungen[j],
        //     "bewertungsaspektId": aspektId
        //   }

        //   console.log(JSON.stringify(feedback,null,2));

        //   FeedbackDataService.create(feedback)
        //     .then(res => {
        //       console.log(JSON.stringify(res.data,null,2));
        //     })
        //     .catch(e => {
        //       console.log("Feedback: " + e);
        //     })
        // }
      }
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
    // },

    // mounted(){
    //   this.getGraderFeedback();
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
</style>