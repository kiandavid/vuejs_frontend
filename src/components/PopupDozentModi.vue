<template>
  <div>
    <!--Pop-up für die Änderung des Dozenten -->
    <div class="pop-up">
      <h3 v-if="!profil">Dozent ändern</h3>
      <div class="form-group">
        <label for="titel">Titel:</label><br>
        <input
          type="text"
          class="form-control"
          id="titel"
          required
          v-model="dozent.titel"
          name="titel"
        />
      </div>
      <div class="form-group">
        <label for="vorname">Vorname:</label><br>
        <input
          type="text"
          class="form-control"
          id="vorname"
          required
          v-model="dozent.vorname"
          name="vorname"
        />
      </div>
      <div class="form-group">
        <label for="nachname">Nachname:</label><br>
        <input
          type="text"
          class="form-control"
          id="nachname"
          required
          v-model="dozent.nachname"
          name="nachname"
        />
      </div>
      <button @click="saveDozent()" class="btn">Änderungen Speichern</button>
      <button v-if="!profil" @click="cancel()" class="btn">Abbrechen</button>
    </div>
  </div>
</template>

<script>
// Service
import DozentDataService from '@/services/DozentDataService';

export default {
    name: "PopupDozentModifikation",
    data() {
      return {
        dozent: {
          titel: "",
          vorname: "",
          nachname: "",
          email: ""
        },
        profil: null,
        isSetup: false
      }
    }, 
    methods: {
      // Speichert Dozenten in der Datenbank
      saveDozent(){
        if(!this.$parent.currentDozent.id){
          this.createDozent();
        } else {
          if(this.dozent.vorname && this.dozent.nachname) {
            this.updateDozent();        
          } else {
              alert("Bitte füllen Sie das Formular vollständig aus!");
          }
        }
      },

      // Legt ein neues Dozentenobjekt in der Datenbank an
      createDozent(){
        DozentDataService.create(this.dozent)
          .then(response => {
            this.dozent = response.data;
            this.$store.dispatch('setDozent', this.dozent);
            alert("Dozent "+ this.dozent.nachname +" wurde erfolgreich geändert!");
          })
          .catch(e => {
            console.log(e);
          });        
      },

      // Updated ein Dozentenobjekt in der Datenbank
      updateDozent(){
        DozentDataService.update(this.$parent.currentDozent.id, this.dozent)
          .then(response => {
            console.log(response.message);
            this.$parent.getDozenten();
            this.$store.dispatch('setDozent', response.data);
            this.$parent.submittedDoz = true;
            alert("Dozent "+ this.dozent.nachname +" wurde erfolgreich geändert!");
            this.isSetup = false;

          })
          .catch(e => {
            console.log(e);
          });        
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.$parent.submittedDoz = true;
        this.isSetup = false;
      },

      // setter für das lokale Dozenten-Objekt
      setDozent(data){
        this.dozent.titel = data.titel;
        this.dozent.vorname = data.vorname;
        this.dozent.nachname = data.nachname;
        this.dozent.email = data.email;
      }
    },
    // Beim Aufruf der Seite wird die Profil-Variable gesetzt
    mounted(){
      this.profil = this.$parent.profil;
    },
    // Beobachter der das Dozenten-Objekt setzt, sobald isSetup geändert wird
    watch: {   
      isSetup() {
        this.setDozent(this.$parent.currentDozent);
      } 
    }
}
</script>

<style scoped>

.form-group{
  margin-bottom: 20px;
}

.btn{
  margin-right: 20px;
}


</style>