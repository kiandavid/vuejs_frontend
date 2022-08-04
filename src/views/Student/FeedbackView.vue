<template>
  <div class="feedback-container">
    <h2>Feedback</h2>
    <!-- Test der Lösungsabgabe -->
    <div>
      <div>
        <h3>Single File</h3>
        <label>File
          <input type="file" @change="handleFileUpload( $event )"/>
        </label>
        <br><br>
        <button v-on:click="submitFile()">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "FeedbackView",
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
			
			submitFile(){

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
         
        };
        
        // ["test-response"] 

     

        // GraderService.create(formData)
				// .then(response => {
        //   console.log(response.data);
        // })
				// .catch(e => {
        //   console.log("Fehler: " + e);
        // });
			},

      printFeedback(){
        for (let i = 0; i < 4; i++) {
          let typ = this.feedbackJSON[i]._attributes.id;
          let punkte = this.feedbackJSON[i]["test-result"]["score"]["_text"];
          console.log("Bewertungsaspekt "+typ+" gibt "+punkte+" Punkt(e)!");
        } 
      }
    }
}
</script>

<style>

  .feedback-container{
    margin-left: 40px;
  }

</style>