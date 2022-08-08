<template>
  <div class="excercise-container">
    <h2>Aufgabe {{id}}</h2>

    <strong id="aufgabe">Aufgabenstellung:</strong><br>
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
            <td>Abgegeben</td>
          </tr>
          <tr>
            <th>Punkte</th>
            <td>5.50/7.00</td>
          </tr>
          <tr>
            <th>Bewertung</th>
            <td>79.5%</td>
          </tr>
      </table>

      <h3>Lösung einreichen</h3>
        <label>Lösung
          <input type="file" @change="handleFileUpload( $event )"/>
        </label>
        <br><br>
        <button v-on:click="submitFile()">Submit</button>
      
      
      <br><br>
      <router-link class="routerlink" to="/feedback">Feedback einsehen</router-link>
      <br><br>
    </div>
    <br><br>
    <router-link class="routerlink" :to="{ name: 'courseStud', params:{ id: id}}">Zurück zum {{bezeichnung}}</router-link>

  </div>
</template>



<script>

import { saveAs } from 'file-saver';

export default {
  name: 'ExcerciseViewStud',
  props: [
    'id',
    'bezeichnung'
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
      aufgabe: ""
    }
  },
  methods: {
      // Funktion um das User-Objekt aus dem State (von Keycloak) zu setzen
      setUser() {
        console.log("User set");
        this.user = this.$store.state.user;
        this.userRole = this.user.realm_access.roles[0];
      },

      // setzt die Datei 
      handleFileUpload( event ){
				this.file = event.target.files[0];
			},
			
			submitFile(){
        console.log("File_Name: " + this.file.name);

        var JSZip = require("jszip");

        var zip = new JSZip();

        // Submission.xml muss hier hinzugefügt werden
        zip.file("submission.xml", this.submissionXML);

        // Generate directorys within the Zip file structure
        var task = zip.folder("task");
        var submission = zip.folder("submission");


        // task.zip muss hier eingebaut werden
        task.file("task.zip", this.file, {base64: true});

        // submission.sql muss hier eingebaut werden
        submission.file("submission.sql", this.file, {base64: true});

        // Generate the zip file asynchronously
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            // Force down of the Zip file
            saveAs(content, "test.zip");
        });

      }

    },
    // Holt alle Kurse aus der Datenbank und setzt den User
    mounted() {
      this.setUser();
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


