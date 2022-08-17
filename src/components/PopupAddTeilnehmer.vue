<template>
  <div class="container">
    <h3>Teilnehmer dem Kurs hinzufügen</h3>
    <!-- Suche Student nach E-Mail-->
    <div class="form-group">
      <label for="bezeichnung">E-Mail-Adresse des Studenten:</label><br>
      <input type="email" class="form-control" id="bezeichnung" required v-model="email"
        name="email" />
    </div>
		<span v-if="studentFound">Student {{student.nachname}} wurde gefunden!</span><br><br>

    <!-- Kontroll Buttons -->
    <button @click="sucheStudent()" class="btn">Student suchen</button>
    <button @click="addStudent()" class="btn">Teilnehmer hinzufügen</button>
    <button @click="cancel()" class="btn">Abbrechen</button>

  </div>
</template>

<script>
// Services
import KursDataService from '@/services/KursDataService';
import StudentDataService from '@/services/StudentDataService';

export default {
  name: "PopupAddExcercise",
  data() {
    return {
			email: "",
			student: {},
			studentFound: false
    }
  },
  methods: {

    // Schließt das Pop-up-Fenster und setzt die E-Mail zurück
    cancel() {
      this.$parent.submittedAdd = true;
      this.email = "";
    },

    /**
     * Sucht anhand der Mail nach dem Studenten in der Datenbank 
     */
		sucheStudent(){
			StudentDataService.findByEmail(this.email)
				.then(res =>{
					if(!res.data[0]){
						alert("Es wurde kein Student mit dieser E-Mail-Adresse gefunden!");
					} else {
						this.student = res.data[0];
						this.studentFound = true;
					}
				})
				.catch(e => {
					console.log(e);
				})
		},

    /**
     * Fügt dem Kurs den gefundenen Studenten hinzu
     * Es werden Meldungen dem Benutzer ausgegeben
     */
    addStudent() {
      if (this.email) {
				const studentId ={
					"studentId": this.student.id
				};
        KursDataService.addStudent(this.$store.state.kurs.id, studentId)
          .then(res => {
						alert("Student " + this.student.nachname + " wurde " + res.data.bezeichnung + " hinzugefügt!");
						this.email = "";
          })
          .catch(e => {
            console.log("Error: " + e);
          });
          this.cancel();
      } else {
        alert("Bitte geben Sie eine E-Mail-Adresse ein!");
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin-left: 0px;
}

.btn {
  margin-right: 20px;
}
</style>