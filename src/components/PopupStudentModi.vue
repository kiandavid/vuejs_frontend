<template>
  <div>
    <!--Pop-up für die Änderung des Studenten -->
    <div class="pop-up">
      <h3>Student ändern</h3>
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
        <label for="email">Email:</label><br>
        <input
          type="text"
          class="form-control"
          id="email"
          required
          v-model="student.email"
          name="email"
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
        <select name="studiengang" id="studiengang">
          <option value="">Bitte auswählen</option>
          <option value="BIN">BIN</option>
          <option value="MDI">MDI</option>
        </select>
      </div>
      <button @click="saveStudent()" class="btn">Änderungen Speichern</button>
      <button @click="cancel()" class="btn">Abbrechen</button>
    </div>
  </div>
</template>

<script>

import StudentDataService from '@/services/StudentDataService';

export default {
    name: "PopupStudentModifikation",
    data() {
      return {
        student: {
          vorname: "",
          nachname: "",
          email: "",
          matrikelnummer: null,
          studiengang: ""
        },
      }
    }, 
    methods: {
      // Updated den Studenten in der Datenbank
      saveStudent(){
        if(this.student.vorname && this.student.nachname && this.student.email && this.student.matrikelnummer) {
          StudentDataService.update(this.$parent.currentStudent.id, this.student)
            .then(response => {
              console.log(response.message);
              this.$parent.getStudenten();
              this.$parent.submittedStud = true;
              alert("Student "+ this.student.nachname +" wurde erfolgreich geändert!");
            })
            .catch(e => {
              console.log(e);
            });
        } else {
            alert("Bitte füllen Sie das Formular vollständig aus!");
        }
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.$parent.submittedStud = true;
      },

      // setter für das lokale Studenten-Objekt
      setStudent(data){
        this.student.vorname = data.vorname;
        this.student.nachname = data.nachname;
        this.student.email = data.email;
        this.student.matrikelnummer = data.matrikelnummer;
        this.student.studiengang = data.studiengang;
      }
    },
    mounted(){
      this.setStudent(this.$parent.currentStudent);
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