<template>
  <div>
    <!-- Dozent: Pop-up für die Kurserstellung -->
    <div class="pop-up" v-if="!this.$parent.submittedAdd">
      <h3>Kurs hinzufügen</h3>
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="kurs.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="semester">Semester:</label><br>
        <input
          class="form-control"
          id="semester"
          required
          v-model="kurs.semester"
          name="semester"
        />
      </div>
      <button @click="saveKurs()" class="btn">Speichern</button>
      <button @click="cancel()" class="btn">Abbrechen</button>
    </div>

    <!-- Dozent: Pop-up für die Änderung -->
    <div class="pop-up" v-if="!this.$parent.submittedUpdate">
      <h3>Kurs ändern</h3>
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="this.$parent.currentKurs.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="semester">Semester:</label><br>
        <input
          class="form-control"
          id="semester"
          required
          v-model="this.$parent.currentKurs.semester"
          name="semester"
        />
      </div>
      <button @click="updateKurs()" class="btn">Änderungen speichern</button>
      <button @click="cancel()" class="btn">Abbrechen</button>
    </div>

  </div>
</template>

<script>
// Services
import KursDataService from '@/services/KursDataService';
import DozentDataService from '@/services/DozentDataService';

export default {
    name: "PopupCourseControl",
    data() {
      return {
        kurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        },
        currentKurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        }
      }
    },
    methods: {

      // Erzeugt einen neuen Kurs in der DB und schließt das Add-Pop-up
      saveKurs(){
        if(this.kurs.bezeichnung != "" && this.kurs.semester != ""){
          var data = {
            bezeichnung: this.kurs.bezeichnung,
            semester: this.kurs.semester
          };
          KursDataService.create(data)
            .then(response => {
              this.kurs.id = response.data.id;
            })
            .catch(e => {
              console.log(e);
            });
          setTimeout(() => this.addKursToDozent(this.$store.state.dozent.id), 100);
          alert(this.kurs.bezeichnung  + " wurde erstellt!");
          this.flushKurs();
          this.$parent.submittedAdd = true;
        } else{
          alert("Bitte vervollständigen Sie das Formular!");
        }
      },

      // Fügt dem Dozenten ein Kursobjekt hinzu
      addKursToDozent(dozId){
        const kurs = {
            "kursId": this.kurs.id
          };
        DozentDataService.addKurs(dozId, kurs)
          .then(res => {
            res.data;
            this.$parent.refresh();
          })
          .catch(e => {
            console.log(e);
          })
      },

      // Updatet den Kurs in der DB
      updateKurs(){
        KursDataService.update(this.$parent.currentKurs.id , this.$parent.currentKurs)
          .then(response => {
            this.message = 'The Course ' + response.data.bezeichnung  +' was updated successfully!';
          })
          .catch(e => {
            console.log(e);
          });
          alert(this.$parent.currentKurs.bezeichnung + " wurde geändert!");
          this.$parent.refresh();
          this.$parent.submittedUpdate = true;
      },

      // Setzt die Kursdaten der Erstellung im Formular zurück
      flushKurs(){
        this.kurs.bezeichnung = "",
        this.kurs.semester = "",
        this.kurs.id = null
      },

      // setzt die Daten des aktuellen Kurses zurück
      flushCurrentKurs(){
        this.$parent.currentKurs.bezeichnung = "",
        this.$parent.currentKurs.semester = "",
        this.$parent.currentKurs.id = null
      },

      // Schließt das Pop-up-Fenster
      cancel(){
        this.$parent.submittedAdd = true;
        this.$parent.submittedUpdate = true;
      },
    }
}
</script>

<style>

.form-group{
  margin-bottom: 20px;
}

.btn{
  margin-right: 20px;
}


</style>