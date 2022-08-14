<template>
  <div class="delete-container">
		<h3>Bitte bestätigen Sie den Vorgang</h3>
		<span>Möchten Sie den {{kurs.bezeichnung}} wirklich löschen?</span><br><br>
		<button id="ja" @click="deleteCourse()">Ja</button>
		<button @click="cancel()">Nein</button>
	</div>
</template>

<script>
import KursDataService from '@/services/KursDataService';
export default {
  name: "PopupDeleteCourse",
  data(){
		return{
			kurs: {}
    }
  },
	methods: {
		deleteCourse(){
			KursDataService.delete(this.kurs.id,0);
			alert("Der " + this.kurs.bezeichnung + " wurde gelöscht!");
			this.$parent.refresh();
			this.$parent.submittedDelete = true;
		},

		cancel(){
			this.$parent.submittedDelete = true;
		}
	},
	mounted(){
		this.kurs = this.$parent.currentKurs;
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


