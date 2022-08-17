<template>
<!-- Bestätigung des Entfernungsvorgangs -->
  <div class="delete-container">
		<h3>Bitte bestätigen Sie den Vorgang</h3>
		<span>Möchten Sie den Student {{student.nachname}} wirklich aus dem Kurs entfernen?</span><br><br>
		<button id="ja" @click="removeFromCourse()">Ja</button>
		<button @click="cancel()">Nein</button>
	</div>
</template>

<script>
// Service
import KursDataService from '@/services/KursDataService';

export default {
  name: "PopupRemoveTeilnehmer",
  data(){
		return{
			student: {}
    }
  },
	methods: {
		/**
		 * Entfernt den Studenten aus dem Kurs
		 */
		removeFromCourse(){
			KursDataService.delete(this.$store.state.kurs.id,this.student.id);
			alert("Der Student " + this.student.nachname + " wurde aus dem Kurs entfernt!");
			this.$parent.teilnehmer = null;
			this.$parent.submittedRemove = true;
		},
		// Schließt das Popup
		cancel(){
			this.$parent.submittedRemove = true;
		}
	},
	// Beim Aufruf wird das Studenten-Objekt gesetzt
	mounted(){
		this.student = this.$parent.currentStudent;
	}
}
</script>

<style scoped>

#ja{
	margin-right: 20px;
}

.delete-container{
	margin-left: 0px;
}

</style>>


