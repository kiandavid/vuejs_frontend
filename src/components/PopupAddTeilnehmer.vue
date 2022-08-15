<template>
  <div class="container">
    <!-- <div class="container" > -->
    <h3>Teilnehmer dem Kurs hinzufügen</h3>
    <div class="form-group">
      <label for="bezeichnung">E-Mail-Adresse des Studenten:</label><br>
      <input type="email" class="form-control" id="bezeichnung" required v-model="email"
        name="email" />
    </div>
		<span v-if="studentFound">Student {{student.nachname}} wurde gefunden!</span><br><br>

    <button @click="sucheStudent()" class="btn">Student suchen</button>
    <button @click="addStudent()" class="btn">Teilnehmer hinzufügen</button>
    <button @click="cancel()" class="btn">Abbrechen</button>

  </div>
</template>

<script>
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

    // Schließt das Pop-up-Fenster
    cancel() {
      this.$parent.submittedAdd = true;
      this.email = "";
    },

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