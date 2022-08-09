<template>
  <div>
		<span v-if="isStudent">Möchten den Studenten {{nachname}} wirklich löschen?</span>
		<span v-if="!isStudent">Möchten den Dozenten {{nachname}} wirklich löschen?</span>
		<button @click="deleteUser()">Ja</button>
		<button @click="cancel()">Nein</button>
	</div>
</template>

<script>
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
		deleteUser(){
			if(this.isStudent) {
				StudentDataService.delete(this.student.id);
				this.$parent.getStudenten();
				alert("Der Student " + this.student.nachname + " wurde gelöscht!");
			} else {
				DozentDataService.delete(this.dozent.id);
				this.$parent.getDozenten();
				alert("Der Dozent " + this.dozent.nachname + " wurde gelöscht!");
			}
			this.$parent.submittedDelete = true;
		},

		cancel(){
			this.$parent.submittedDelete = true;
		}
	},
	mounted(){
		this.isStudent = this.$parent.isStudent;
		if(this.isStudent) {
			this.student = this.$parent.currentStudent;
			this.nachname = this.student.nachname;
		} else {
			this.dozent = this.$parent.currentDozent;
			this.nachname = this.student.nachname;
		}
	}
}
</script>

<style>

</style>