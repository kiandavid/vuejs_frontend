<template>
	<!-- Bestätigung des Löschvorgangs  -->
  <div class="container">
		<h2>Bitte bestätigen Sie den Vorgang</h2>
		<span>Möchten Sie die {{aufgabe.bezeichnung}} wirklich löschen?</span><br><br>
		<button id="ja" @click="deleteExcercise()">Ja</button>
		<button @click="cancel()">Nein</button>
	</div>
</template>

<script>
// Services
import AufgabeDataService from '@/services/AufgabeDataService';

export default {
  name: "PopupDeleteExcercise",
  data(){
		return{
			aufgabe: {}
    }
  },
	methods: {
		// Löscht die Aufgabe und schließt das Popup
		deleteExcercise(){
			AufgabeDataService.delete(this.aufgabe.id);
			alert("Die Aufgabe " + this.aufgabe.bezeichnung + " wurde gelöscht!");
			this.$parent.aufgaben = null;
			this.$parent.submittedDelete = true;
		},
		// schließt das Popup
		cancel(){
			this.$parent.submittedDelete = true;
		}
	},
	// Beim Aufruf wird die aktuelle Aufgabe gesetzt
	mounted(){
		this.aufgabe = this.$parent.currentAufgabe;
	}
}
</script>

<style scoped>

#ja{
	margin-right: 20px;
}

.container{
	margin-left: 40px;
}

</style>>


