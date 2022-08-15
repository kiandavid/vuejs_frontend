<template>
  <div class="delete-container">
		<h3>Bitte bestätigen Sie den Vorgang</h3>
		<span>Möchten Sie den Student {{student.nachname}} wirklich aus dem Kurs entfernen?</span><br><br>
		<button id="ja" @click="deleteCourse()">Ja</button>
		<button @click="cancel()">Nein</button>
	</div>
</template>

<script>
import KursDataService from '@/services/KursDataService';
export default {
  name: "PopupRemoveTeilnehmer",
  data(){
		return{
			student: {}
    }
  },
	methods: {
		deleteCourse(){
			KursDataService.delete(this.$store.state.kurs.id,this.student.id);
			alert("Der Student " + this.student.nachname + " wurde aus dem Kurs entfernt!");
			this.$parent.teilnehmer = null;
			this.$parent.submittedRemove = true;
		},

		cancel(){
			this.$parent.submittedRemove = true;
		}
	},
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


