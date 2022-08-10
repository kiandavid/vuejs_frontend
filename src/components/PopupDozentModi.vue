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
      <!-- <div class="form-group" v-if="!profil">
        <label for="email">Email:</label><br>
        <input
          type="text"
          class="form-control"
          id="email"
          required
          v-model="dozent.email"
          name="email"
        />
      </div> -->
      <button @click="saveDozent()" class="btn">Änderungen Speichern</button>
      <button v-if="!profil" @click="cancel()" class="btn">Abbrechen</button>
    </div>
  </div>
</template>

<script>

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
            this.$parent.submittedDoz = true;
            alert("Dozent "+ this.dozent.nachname +" wurde erfolgreich geändert!");
          })
          .catch(e => {
            console.log(e);
          });        
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.$parent.submittedDoz = true;
      },

      // setter für das lokale Dozenten-Objekt
      setDozent(data){
        this.dozent.titel = data.titel;
        this.dozent.vorname = data.vorname;
        this.dozent.nachname = data.nachname;
        this.dozent.email = data.email;
        // console.log("pop"+JSON.stringify(this.dozent,null,2));
      }
    },
    mounted(){
      // setTimeout(() => this.setDozent(this.$parent.currentDozent), 500);
      this.profil = this.$parent.profil;
    },
    watch: {   
      isSetup() {
        console.log('User in Popup set!');
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