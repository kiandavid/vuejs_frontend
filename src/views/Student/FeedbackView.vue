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
// import GraderService from '@/services/GraderService';
import FeedbackDetails from '@/components/FeedbackDetails.vue';
import LoesungDataService from '@/services/LoesungDataService';
import BewertungsaspektDataService from '@/services/BewertungsaspektDataService';
import FeedbackDataService from '@/services/FeedbackDataService';

// import LoesungDataService from '@services/LoesungDataService';
// import BewertungsaspektDataService from '@/services/BewertungsaspektDataService';
// import FeedbackDataService from '@/services/FeedbackDataService';

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
      bewertungsaspekte: []
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
          bewertungsaspekt.anmerkungen[0] = anmerkungen["student-feedback"]["content"]["_text"];
        } else {
          for (let j = 0; j < length; j++) {
            let anmerkung = {
              "id": j + 1,
              "anmerkung": anmerkungen["student-feedback"][j]["content"]["_text"]
            };
            bewertungsaspekt.anmerkungen[j] = anmerkung;
          }
          // bewertungsaspekt.anmerkungen = arrayAnmerkungen;
        }
        this.bewertungsaspekte[i] = bewertungsaspekt;
      }
      // console.log("Neues Array: " + JSON.stringify(this.bewertungsaspekte, null, 2));
      this.$refs.aspekt1.feedbackReady = true;
      this.$refs.aspekt2.feedbackReady = true;
      this.$refs.aspekt3.feedbackReady = true;
      this.$refs.aspekt4.feedbackReady = true;
      // this.loesungPersistieren();
    },

    loesungPersistieren() {

      // Hier weitermachen, vielleicht kann ich für die bezeichnung die aufgabenId.toString und den Nachnamen des Studenten reinklatschen
      var loesungsString = this.responseJSON["response"]["separate-test-feedback"]["submission-feedback-list"]["student-feedback"][1]["content"]["_cdata"];

      var aufgabenIdString = this.aufgabenId.toString();
      var nachnameStud = this.$store.state.student.nachname;
      var bezeichnung = "aufgabe_" + aufgabenIdString + "_" + nachnameStud;
      var punkte_erreicht = 0.0;
      
      console.log(loesung);
      console.log(loesungsString);

      for(let i=0; i< this.bewertungsaspekte.length; i++){
        punkte_erreicht += this.bewertungsaspekte[i].punkte;
      }

      // Alles ab hier dann persisiteren

      const loesung = {
        "bezeichnung": bezeichnung,
        "punkte": punkte_erreicht,
        "loesung": loesungsString,
        "aufgabenId": this.aufgabenId,
        "studentId": this.$store.state.student.id
      };

      var loesungsId;

      LoesungDataService.create(loesung)
        .then(res =>{
          console.log(res);
          loesungsId = res.data.id;
        })
        .catch(e => {
          console.log(e);
        })

       for(let i=0; i< this.bewertungsaspekte.length; i++){
          const bewertungsaspekt = {
            "typ": this.bewertungsaspekte[i].typ,
            "punkte": this.bewertungsaspekte[i].punkte,
            "loesungsId": loesungsId
          };

          var aspektId;

          BewertungsaspektDataService.create(bewertungsaspekt)
            .then(res => {
              console.log(res);
              aspektId = res.data.id;
            })
            .catch(e => {
              console.log(e);
            })

          for(let j=0; j< this.bewertungsaspekte.anmerkungen.length; j++){
            const feedback = {
              "anmerkung": this.bewertungsaspekte.anmerkungen[j],
              "aspektId": aspektId
            }

            FeedbackDataService.create(feedback)
              .then(res => {
                console.log(res);
              })
              .catch(e => {
                console.log(e);
              })
          }
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