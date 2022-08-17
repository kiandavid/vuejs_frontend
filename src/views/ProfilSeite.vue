<template>
    <div class="profile-container">
      <h2>Profil vervollständigen</h2>
			<!-- Popup-Fenster zum Ändern der Dozenten und Studenten -->
			<PopupDozentModi ref="dozent" v-if="userRole=='Dozent'"></PopupDozentModi>
			<PopupStudentModi ref="student" v-if="userRole=='Student'"></PopupStudentModi>
    </div>
</template>

<script>
// SFCs
import PopupDozentModi from '@/components/PopupDozentModi.vue'
import PopupStudentModi from '@/components/PopupStudentModi.vue'

// Services
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
		/**
     * Holt die Benutzerrolle aus dem globalen Speicher und speichert sie lokal
		 * Anschließend wird die E-Mail-Adresse des Benutzers gesetzt
		 */
    setUserRoleAndMail() {
      let userTemp = this.$store.state.user;
      this.userRole = userTemp.realm_access.roles[0];
			if(this.userRole=="Student") {
				this.currentStudent.email = userTemp.email;
			} else {
				this.currentDozent.email = userTemp.email;
			}
    },

		/**
		 * setzt das akutelle Benutzerobjekt mit den Daten aus dem State
		 * Über das currentUser-Objekt, können die Popup-SFCs auf die Daten zugreifen
		 * Über this.$refs.student.isSetup wird ein Boolean in der Kind-Komponente gesetzt 
		 */
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
			}
		},

		/**
		 * Dummy-Methoden die aus der Child-Komponente aufgerufen werden
		 * Die Popup-SFCs werden mehrfach verwendet, daher müssen diese 
		 * Methoden in der Parent-Komponente verfügbar sein
		 */
		getStudenten(){
			this.submittedStud = false;
		},
		getDozenten(){
			this.submittedStud = false;
		},

		
		/**
		 * Student wird nach seiner Mail in der Datenbank gesucht
		 * Falls dieser Student noch nicht in der Datenbank verhanden ist,
		 * wird die Methode setCurrentUser() aufgerufen
		 */
		findStudByMail(){
			StudentDataService.findByEmail(this.currentStudent.email)
				.then(response => {
					let antwort = response.data[0];
					if(antwort){
						this.currentStudent =  antwort;
						this.$refs.student.isSetup = true;
					} else {
						this.setCurrentUser();
					}
				})
				.catch(e => {
				console.log(e);
				})
		},

		/**
		 * Dozent wird nach seiner Mail in der Datenbank gesucht
		 * Falls dieser Dozent noch nicht in der Datenbank verhanden ist,
		 * wird die Methode setCurrentUser() aufgerufen
		 */
		findDozByMail(){
			DozentDataService.findByEmail(this.currentDozent.email)
				.then(response => {
					let antwort = response.data[0];
					if(antwort){
						this.currentDozent =  antwort;
						this.$refs.dozent.isSetup = true;
					} else {
						this.setCurrentUser();
					}
				})
				.catch(e => {
				console.log(e);
				})
		},

		/**
		 * Abhängig von der Benutzerrolle wird der Benutzer
		 * nach seiner E-Mail gesucht
		 */
		findByMail(){
			if (this.userRole=="Student"){
				this.findStudByMail();
			} else {
				this.findDozByMail();
			}
		}

	/**
	 * Bevor die Komponente zusammengestellt wird,
	 * wird der Benutzer und seine E-Mail lokal gespeichert.
	 * Anschließend wird nach dem Benutzer in der Datenbank gesucht
	 */
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