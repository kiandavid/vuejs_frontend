<template>
  <div class="container">
    <div class="file-upload">
      <h2>Feedback</h2>    
      <h3>Beispiel Feedback-Datei</h3>
      <input type="file" @change="handleFileUpload( $event )"/>
      <br><br>
      <button @click="feedbackAuslesen()">Bestätigen</button>
    </div>
    <div class="feedback">
      <!-- <div class="item1"><FeedbackDetails ref="aspekt" index="0"></FeedbackDetails></div>
      <div class="item2"><FeedbackDetails ref="aspekt" index="1"></FeedbackDetails></div> 
      <div class="item3"><FeedbackDetails ref="aspekt" index="2"></FeedbackDetails></div>
      <div class="item4"><FeedbackDetails ref="aspekt" index="3"></FeedbackDetails></div>  -->
    </div>
  </div>
</template>

<script>
// import GraderService from '@/services/GraderService';
// import FeedbackDetails from '@/components/FeedbackDetails.vue';

export default {
    name: "FeedbackView",
    // props: ['response'],
    components: {
      // FeedbackDetails
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
            // Feedback auf der Konsole ausgeben
            for (let i = 0; i < this.feedbackJSON.length; i++) {
              let typ = this.feedbackJSON[i]._attributes.id;
              let punkte = this.feedbackJSON[i]["test-result"]["result"]["score"]["_text"];
              let anmerkungen = this.feedbackJSON[i]["test-result"]["feedback-list"];
              console.log("Der Bewertungsaspekt "+ typ + " bringt "+ punkte + " Punkt(e)!");
              let length = Object.keys(anmerkungen["student-feedback"]).length;
              if(length==3){
                console.log("Anmerkung: " + anmerkungen["student-feedback"]["content"]["_text"]);
              } else {
                for (let i = 0; i < length; i++) {
                  console.log("Anmerkung: " + anmerkungen["student-feedback"][i]["content"]["_text"]);
                } 
              }

            }
        };
			},

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

  .feedback{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    height: 100%;
  }

</style>