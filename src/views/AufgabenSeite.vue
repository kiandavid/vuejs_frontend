<template>
  <div class="excercise-container">
    <h2>{{aufgabe.bezeichnung}}</h2>

    <strong id="aufgabe">Aufgabenstellung:</strong><br><br>
    <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</span><br><br>


    <!-- Aufgabenübersicht des Dozenten -->
    <table id="tabelleAufgabe" v-if="userRole=='Dozent'">
      <tr>
        <th>Student</th>
        <th>Matrikelnummer</th>
        <th>Status</th>
        <th>Erreichte Punkte</th>
      </tr>
      <tr class="teilnehmer-container" v-for="pers in studenten" :key="pers.id">
        <td>{{pers.vorname}} {{pers.name}}</td>
        <td>{{pers.matrikelnummer}}</td>
        <td>{{pers.status}}</td>
        <td>{{pers.punkte}}</td>
      </tr>
    </table>

    <!-- Sicht der Studenten -->
    <div v-if="userRole=='Student'">
      <table id="AufgabenDetails">
          <tr>
            <th>Status</th>
            <td>{{status}}</td>
          </tr>
          <tr>
            <th>Punkte</th>
            <td>{{punkte}} / {{punkte_max}}.0</td>
          </tr>
          <tr>
            <th>Bewertung</th>
            <td>{{bewertung}}</td>
          </tr>
      </table>

      <h3>Lösung einreichen</h3>
      <input type="file" @change="handleFileUpload( $event )"/>
      <br><br>
      <button v-on:click="submitFile()">Lösung einreichen</button>
      
      
      <br><br><br><br>
      <router-link class="routerlink" :to="{ name: 'FeedbackStud', params:{ response: responseData, aufgabenId: this.id }}">Feedback einsehen</router-link>
      
    </div>
    <br><br>
    <router-link class="routerlink" :to="{ name: 'kurs', params:{ id: kursId}}">Zurück zum {{bezeichnung}}</router-link>

  </div>
</template>



<script>

import AufgabeDataService from '@/services/AufgabeDataService';

export default {
  name: 'AufgabenSeite',
  props: [
    'id',
    'bezeichnung',
    'kursId'
  ],
  data() {
    return {
      studenten: [
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"}
      ],
      user: null,
      userRole: "",
      file: "",
      submissionXML: "",
      responseData: {},
      aufgabe: {},
      status: "Nicht abgegeben",
      punkte: "-",
      punkte_max: null,
      bewertung: "0.0%"

    }
  },
  methods: {
      // Funktion um das User-Objekt aus dem State (von Keycloak) zu setzen
      setUser() {
        console.log("User set");
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
      },

      // Holt die Aufgabe aus der Datenbank
      getAufgabe(id){
        AufgabeDataService.get(id)
          .then(response => {
            this.aufgabe = response.data;
            this.punkte_max = response.data.punkte_max;
            // console.log(JSON.stringify(response.data,null,2));
          })
          .catch(e => {
            console.log(e);
          })
      },


      // setzt die Datei 
      handleFileUpload( event ){
				this.file = event.target.files[0];
			},
			
		// 	reicheLösungEin(){
    //     console.log("File_Name: " + this.file.name);
    //     var JSZip = require("jszip");
    //     var zip = new JSZip();
    //     // Submission.xml muss hier hinzugefügt werden
    //     zip.file("submission.xml", this.submissionXML);
    //     // Generate directorys within the Zip file structure
    //     var task = zip.folder("task");
    //     var submission = zip.folder("submission");
    //     // task.zip muss hier eingebaut werden
    //     task.file("task.zip", this.file, {base64: true});
    //     // submission.sql muss hier eingebaut werden
    //     submission.file("submission.sql", this.file, {base64: true});

    //     // Generate the zip file asynchronously
    //     zip.generateAsync({type:"blob"})
    //       .then(function(content) {
    //         GraderService.submit(content)
    //         .then(response => {
    //           this.responseData = response.data;
    //         })
    //         .catch(e => {
    //           console.log("Fehler: " + e);
    //         });
    //       });
    //   }

    },


    // Holt alle Kurse aus der Datenbank und setzt den User
    mounted() {
      this.setUser();
      this.getAufgabe(this.id);
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


