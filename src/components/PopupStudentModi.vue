<template>
  <div>
    <!--Pop-up für die Änderung des Studenten -->
    <div class="pop-up">
      <h3 v-if="!profil">Student ändern</h3>
      <div class="form-group">
        <label for="vorname">Vorname:</label><br>
        <input
          type="text"
          class="form-control"
          id="vorname"
          required
          v-model="student.vorname"
          name="vorname"
        />
      </div>
      <div class="form-group">
        <label for="nachname">Nachname:</label><br>
        <input
          type="text"
          class="form-control"
          id="nachname"
          required
          v-model="student.nachname"
          name="nachname"
        />
      </div>
      <div class="form-group">
        <label for="matrikelnummer">Matrikelnummer:</label><br>
        <input
          type="number"
          class="form-control"
          id="matrikelnummer"
          required
          v-model="student.matrikelnummer"
          name="matrikelnummer"
        />
      </div>
      <div class="form-group">
        <label for="studiengang">Studiengang:</label><br>
        <select v-model="student.studiengang" name="studiengang" id="studiengang">
          <option value="">Bitte auswählen</option>
          <option value="BIN">BIN</option>
          <option value="MDI">MDI</option>
        </select>
      </div>
      <button @click="saveStudent()" class="btn">Änderungen Speichern</button>
      <button v-if="!profil" @click="cancel()" class="btn">Abbrechen</button>
    </div>
  </div>
</template>

<script>
// Service
import StudentDataService from '@/services/StudentDataService';

export default {
    name: "PopupStudentModifikation",
    data() {
      return {
        student: {
          id: null,
          vorname: "",
          nachname: "",
          email: "",
          matrikelnummer: null,
          studiengang: ""
        },
        profil: null,
        isSetup: false
      }
    }, 
    methods: {
      // Speichert Student in der Datenbank
      saveStudent(){
        if(!this.$parent.currentStudent.id){
          this.createStudent();
        } else {
          if(this.student.vorname && this.student.nachname && this.student.matrikelnummer && this.student.studiengang) {
            this.updateStudent();        
          } else {
              alert("Bitte füllen Sie das Formular vollständig aus!");
          }
        }
      },

      // Legt ein neues Studentenobjekt in der Datenbank an
      createStudent(){
        StudentDataService.create(this.student)
          .then(response => {
            this.student = response.data;
            this.$store.dispatch('setStudent', this.student);
            alert("Student "+ this.student.nachname +" wurde erfolgreich geändert!");
          })
          .catch(e => {
            console.log(e);
          });        
      },

      // Updated ein Studentenobjekt in der Datenbank
      updateStudent(){
        StudentDataService.update(this.$parent.currentStudent.id, this.student)
          .then(response => {
            console.log(response.message);
            this.$parent.getStudenten();
            this.$store.dispatch('setStudent', response.data);
            this.$parent.submittedStud = true;
            alert("Student "+ this.student.nachname +" wurde erfolgreich geändert!");
            this.isSetup = false;
          })
          .catch(e => {
            console.log(e);
          });        
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.$parent.submittedStud = true;
        this.isSetup = false;
      },

      // setter für das lokale Studenten-Objekt
      setStudent(data){
        this.student.id = data.id;
        this.student.vorname = data.vorname;
        this.student.nachname = data.nachname;
        this.student.email = data.email;
        this.student.matrikelnummer = data.matrikelnummer;
        this.student.studiengang = data.studiengang;
      },
    },
    // Beim Aufruf der Seite wird die Profil-Variable gesetzt
    mounted(){
      this.profil = this.$parent.profil;
    },
    // Beobachter der das Studenten-Objekt setzt, sobald isSetup geändert wird
    watch: {   
      isSetup() {
        this.setStudent(this.$parent.currentStudent);
      }
    }
}
</script>

<style scoped>

.form-group{
  margin-bottom: 20px;
}

.btn{
  margin-right: 20px;
}


</style>