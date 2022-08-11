<template>
  <div class="container">
    <div class="file-upload">
      <h2>Feedback</h2>    
      <h3>Beispiel Feedback-Datei</h3>
      <input type="file" @change="handleFileUpload( $event )"/>
      <br><br>
      <button v-on:click="feedbackAuslesen()">Bestätigen</button>
    </div>
    <div class="feedback">
      <div id="item1"><FeedbackDetails></FeedbackDetails></div>
      <div id="item2"><FeedbackDetails></FeedbackDetails></div>
      <div id="item3"><FeedbackDetails></FeedbackDetails></div>
      <div id="item4"><FeedbackDetails></FeedbackDetails></div>
    </div>
  </div>
</template>

<script>
// import GraderService from '@/services/GraderService';
import FeedbackDetails from '@/components/FeedbackDetails.vue';

export default {
    name: "FeedbackView",
    props: ['response'],
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
        feedbackJSON: {}
      }
    },
    methods: {
       
      handleFileUpload( event ){
				this.file = event.target.files[0];
			},
			


			feedbackAuslesen(){
        var reader = new FileReader();
        reader.readAsText(this.file);
        reader.onloadend = function(){

            // Liest den Text der XML-Datei
            this.xmlString = reader.result;
            // Konvertiert XML-Datei ins JSON-Format
            var convert = require('xml-js');
            var response = convert.xml2json(this.xmlString, {compact: true, spaces: 2});
            // Parst JSON
            this.responseJSON = JSON.parse(response);
            // wählt das Feedback aus der Datei aus
            this.feedbackJSON = this.responseJSON["response"]["separate-test-feedback"]["tests-response"]["test-response"];
      
            let typ = this.feedbackJSON[0]._attributes.id;
            let punkte = this.feedbackJSON[0]["test-result"]["result"]["score"]["_text"];
            console.log("Bewertungsaspekt "+typ+" gibt "+ punkte +" Punkt(e)!");
            console.log(JSON.stringify(this.feedbackJSON[0],null,2));
        };
			},

    //   // gibt Feedback aus
    //   printFeedback(){
    //     for (let i = 0; i < 4; i++) {
    //       let typ = this.feedbackJSON[i]._attributes.id;
    //       let punkte = this.feedbackJSON[i]["test-result"]["score"]["_text"];
    //       console.log("Bewertungsaspekt "+typ+" gibt "+punkte+" Punkt(e)!");
    //     } 
    //   },

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


  /* .container{
    background-color: blueviolet
  } */

  /* .file-upload{
    background-color: aquamarine;
  } */

  .feedback{
    background-color: brown;
    display: flex;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    height: 100%;
  }

  #item1{
    background-color: aqua;
  }

  #item2{
    background-color: blue;
  }

  #item3{
    background-color: blanchedalmond;
  }

  #item4{
    background-color: forestgreen;
  }
</style>