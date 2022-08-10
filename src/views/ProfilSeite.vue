<template>
    <div class="profile-container">
        <h2>Profil vervollständigen</h2>

				<PopupDozentModi ref="dozent" v-if="userRole=='Dozent'"></PopupDozentModi>
				<PopupStudentModi ref="student" v-if="userRole=='Student'"></PopupStudentModi>
    </div>
</template>

<script>
import PopupDozentModi from '@/components/PopupDozentModi.vue'
import PopupStudentModi from '@/components/PopupStudentModi.vue'

import StudentDataService from '@/services/StudentDataService';
import DozentDataService from '@/services/DozentDataService';

export default {
  name: "ProfilSeite",
	components: {
		PopupDozentModi,
		PopupStudentModi
	},
	data(){
		return{
			userRole: null,
			currentStudent: {
				id: null,
				vorname: "",
				nachname: "",
				email: "",
				matrikelnummer: null,
				studiengang: ""
			},
			currentDozent: {
				id: null,
				vorname: "",
				nachname: "",
				email: "",
				titel: ""
			},
			submittedDoz: true,
			submittedStud: true,
			profil: true
		}
	},
	methods: {
    // Funktion um das User-Objekt aus dem State zu setzen
    setUserRoleAndMail() {
      let userTemp = this.$store.state.user;
      this.userRole = userTemp.realm_access.roles[0];
			if(this.userRole=="Student") {
				this.currentStudent.email = userTemp.email;
			} else {
				this.currentDozent.email = userTemp.email;
			}
    },

		setCurrentUser(){
      let userTemp = this.$store.state.user;
			if(this.userRole=="Student") {
				this.currentStudent.vorname = userTemp.given_name;
				this.currentStudent.nachname = userTemp.family_name;
				this.currentStudent.email = userTemp.email;
				this.$refs.student.isSetup = true;
			} else {
				this.currentDozent.vorname = userTemp.given_name;
				this.currentDozent.nachname = userTemp.family_name;
				this.currentDozent.email = userTemp.email;
				this.$refs.dozent.isSetup = true;
				// console.log("Profil: " + JSON.stringify(this.currentDozent,null,2));
			}
		},

		// dummy Methoden
		getStudenten(){
			this.submittedStud = false;
		},
		getDozenten(){
			this.submittedStud = false;
		},

		// Student wird nach seiner Mail gesucht
		findStudByMail(){
			StudentDataService.findByEmail(this.currentStudent.email)
				.then(response => {
					let antwort = response.data[0];
					if(antwort){
						this.currentStudent =  antwort;
						// console.log("testo: " + JSON.stringify(this.currentStudent,null,2));
						this.$refs.student.isSetup = true;
					} else {
						this.setCurrentUser();
					}
				})
				.catch(e => {
				console.log(e);
				})
		},
		// Dozent wird nach seiner Mail gesucht 
		findDozByMail(){
			DozentDataService.findByEmail(this.currentDozent.email)
				.then(response => {
					let antwort = response.data[0];
					if(antwort){
						this.currentDozent =  antwort;
						// console.log("testo: " + JSON.stringify(this.currentDozent,null,2));
						this.$refs.dozent.isSetup = true;
					} else {
						this.setCurrentUser();
					}
				})
				.catch(e => {
				console.log(e);
				})
		},

		// Benutzer wird nach seiner Mail gesucht
		findByMail(){
			if (this.userRole=="Student"){
				this.findStudByMail();
			} else {
				this.findDozByMail();
			}
		}


	},
	beforeMount(){
		this.setUserRoleAndMail();
		this.findByMail();
	}
}
</script>

<style scoped>
.profile-container{
    margin-left: 40px;
}
</style>