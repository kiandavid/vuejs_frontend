<template>
  <div class="container">
    <!-- <div class="container" > -->
    <h3>Aufgabe hinzufügen</h3>
    <div class="form-group">
      <label for="bezeichnung">Bezeichnung:</label><br>
      <input type="text" class="form-control" id="bezeichnung" required v-model="aufgabe.bezeichnung"
        name="bezeichnung" />
    </div>
    <div class="form-group">
      <label for="punkte_max">Maximal erreichbare Punktzahl:</label><br>
      <input class="form-control" id="punkte_max" required v-model="aufgabe.punkte_max" name="punkte_max" />
    </div>
    <div class="form-group">
      <label for="aufgabe">Aufgabendatei:</label><br>
      <input type="file" class="form-control" id="aufgabe" name="aufgabe" @change="handleFileUpload( $event )"/>
    </div>

    <button @click="saveAufgabe()" class="btn">Aufgabe speichern</button>
    <button @click="cancel()" class="btn">Abbrechen</button>
  </div>
</template>

<script>

import AufgabeDataService from '@/services/AufgabeDataService';

export default {
  name: "PopupAddExcercise",
  data() {
    return {
      aufgabe: {
        id: null,
        bezeichnung: "",
        punkte_max: null,
        aufgabe: {},
        kursId: this.$parent.kurs.id
      }
    }
  },
  methods: {

    // Schließt das Pop-up-Fenster
    cancel() {
      this.$parent.submittedAdd = true;
      this.flushAufgabe();
    },

    handleFileUpload( event ){
        this.aufgabe.aufgabe = event.target.files[0];
        console.log(this.aufgabe.aufgabe);
    },

    // Speichert die Aufgabe im ausgewählten Kurs
    saveAufgabe() {
      if (this.aufgabe.bezeichnung && this.aufgabe.punkte_max && this.aufgabe.aufgabe) {
        var data = new FormData();
        data.append("bezeichnung", this.aufgabe.bezeichnung);
        data.append("punkte_max", this.aufgabe.punkte_max);
        data.append("aufgabe", this.aufgabe.aufgabe);
        data.append("kursId", this.aufgabe.kursId);
        AufgabeDataService.create(data)
          .then(response => {
            this.aufgabe.id = response.data.id;
          })
          .catch(e => {
            console.log("Error: " + e);
          });
          this.cancel();
      } else {
        alert("Bitte vervollständigen Sie das Formular!");
      }
    },

    flushAufgabe() {
      this.aufgabe.id = null;
      this.aufgabe.bezeichnung = "";
      this.aufgabe.punkte_max = null;
      this.aufgabe.aufgabe = "";
    }
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