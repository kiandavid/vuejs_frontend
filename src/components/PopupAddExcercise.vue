<template>
  <div class="container">
    <h3>Aufgabe hinzufügen</h3>
    <!-- Formular für die Aufgabenattribute -->
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

    <!-- Kontroll Buttons -->
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

    // Schließt das Pop-up-Fenster und löscht die akutelle Aufgabe
    cancel() {
      this.$parent.submittedAdd = true;
      this.flushAufgabe();
    },

    /**
       * Bei Auswahl einer Datei, wird diese lokal gesetzt
       * @param {object} event - Event wird beim Hochladen einer Datei getriggert
       */
    handleFileUpload( event ){
        this.aufgabe.aufgabe = event.target.files[0];
    },

    // Speichert die Aufgabe im ausgewählten Kurs
    /**
     * Speichert die Aufgabe in der Datenbank
     * Die Input-Felder dürfen nicht leer sein, sonst wird eine Nachricht ausgegeben.
     * Um die Aufgaben.zip auf dem lokalen Dateisystem
     * über Node.js speichern zu können, müssen die Daten
     * als FormData-Objekt geschickt werden.
     * Abschließend wird das Popup geschlossen
     */
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
            alert("Die "+ this.aufgabe.bezeichnung +" wurde erfolgreich erstellt!");
          })
          .catch(e => {
            console.log("Error: " + e);
          });
          this.cancel();
      } else {
        alert("Bitte vervollständigen Sie das Formular!");
      }
    },

    
    /**
     * Resetted die ausgewählte Aufgabe
     */
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