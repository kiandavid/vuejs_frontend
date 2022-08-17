<template>
  <div>
	<!-- Bestätigung des Löschvorgangs  -->
		<h2>Bitte bestätigen Sie den Vorgang</h2>
		<span v-if="isStudent">Möchten den Studenten {{nachname}} wirklich löschen?</span>
		<span v-if="!isStudent">Möchten den Dozenten {{nachname}} wirklich löschen?</span><br><br>
		<button id="ja" @click="deleteUser()">Ja</button>
		<button @click="cancel()">Nein</button>
	</div>
</template>

<script>
// Services
import StudentDataService from '@/services/StudentDataService';
import DozentDataService from "../services/DozentDataService";

export default {
  name: "PopupDeleteUser",
  data(){
		return{
			student: "",
			dozent: "",
			isStudent: null,
			nachname: ""
    }
  },
	methods: {
		// Löscht den Benutzer abhängig von der Benutzerrolle in der Datenbank
		deleteUser(){
			if(this.isStudent) {
				StudentDataService.delete(this.student.id);
				alert("Der Student " + this.student.nachname + " wurde gelöscht!");
				this.$parent.getStudenten();
			} else {
				DozentDataService.delete(this.dozent.id);
				alert("Der Dozent " + this.dozent.nachname + " wurde gelöscht!");
				this.$parent.getDozenten();
			}
			this.$parent.submittedDelete = true;
		},

		// schließt das Popup 
		cancel(){
			this.$parent.submittedDelete = true;
		}
	},
	// Beim Aufruf wird, abhängig von der Benutzerolle, der Benutzer gesetzt
	mounted(){
		this.isStudent = this.$parent.isStudent;
		if(this.isStudent) {
			this.student = this.$parent.currentStudent;
			this.nachname = this.student.nachname;
		} else {
			this.dozent = this.$parent.currentDozent;
			this.nachname = this.dozent.nachname;
		}
	}
}
</script>

<style>

#ja{
	margin-right: 20px;
}

</style>