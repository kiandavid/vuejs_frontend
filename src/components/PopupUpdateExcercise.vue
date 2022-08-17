<template>
  <div class="container">
    <!-- Popup zum Ändern einer Aufgabe -->
    <h3>Aufgabe ändern</h3>
    <div class="form-group">
      <label for="bezeichnung">Bezeichnung:</label><br>
      <input type="text" class="form-control" id="bezeichnung" required v-model="aufgabe.bezeichnung"
        name="bezeichnung" />
    </div>
    <div class="form-group">
      <label for="punkte_max">Maximal erreichbare Punktzahl:</label><br>
      <input class="form-control" id="punkte_max" required v-model="aufgabe.punkte_max" name="punkte_max" />
    </div>

    <button @click="saveAufgabe()" class="btn">Aufgabe speichern</button>
    <button @click="cancel()" class="btn">Abbrechen</button>

  </div>
</template>

<script>
// Service
import AufgabeDataService from '@/services/AufgabeDataService';

export default {
  name: "PopupAddExcercise",
  data() {
    return {
      aufgabe: {},
      updated: false
    }
  },
  methods: {

    // Schließt das Pop-up-Fenster
    cancel() {
      this.flushAufgabe();
      this.$parent.submittedUpdate = true;
    },



    // Ändert die Aufgabe in der Datenbank
    saveAufgabe() {
      if (this.aufgabe.bezeichnung && this.aufgabe.punkte_max) {
        var data = {
          bezeichnung: this.aufgabe.bezeichnung,
          punkte_max: this.aufgabe.punkte_max,
        };
        AufgabeDataService.update(this.aufgabe.id, data)
          .then(response => {
            console.log(JSON.stringify(response.data,null,4));
            alert(this.aufgabe.bezeichnung + " wurde erfolgreich geändert!");
            this.cancel();
          })
          .catch(e => {
            console.log("Error: " + e);
          });
      } else {
        alert("Bitte vervollständigen Sie das Formular!");
      }
    },

    // Setzt die ausgewählte Aufgabe zurück
    flushAufgabe() {
      this.aufgabe.id = null;
      this.aufgabe.bezeichnung = "";
      this.aufgabe.punkte_max = null;
      this.aufgabe.aufgabe = "";
    }
  },
  // Beim Aufruf wird die Aufgabe gesetzt
  mounted(){
    this.aufgabe = this.$parent.currentAufgabe;
  }
}
</script>

<style scoped>
.container {
  margin-left: 40px;
}

.btn {
  margin-right: 20px;
}
</style>