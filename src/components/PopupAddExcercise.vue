<template>
  <div class="container" v-if="!this.$parent.submittedAdd">
  <!-- <div class="container" > -->
		<h3>Aufgabe hinzufügen</h3>
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="aufgabe.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="punkte_max">Maximal erreichbare Punktzahl:</label><br>
        <input
          class="form-control"
          id="punkte_max"
          required
          v-model="aufgabe.punkte_max"
          name="punkte_max"
        />
      </div>
      <div class="form-group">
				<label for="aufgabenpfad">Dateipfad der Aufgabe:</label><br>
        <input
          type="text"
          class="form-control"
          id="aufgabenpfad"
          required
          v-model="aufgabe.aufgabenpfad"
          name="aufgabenpfad"
        />
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
        aufgabenpfad: "",
        kursId: this.$parent.kurs.id
      }
		}
	},
	methods: {

		// Schließt das Pop-up-Fenster
    cancel(){
      this.$parent.submittedAdd = true;
      this.flushAufgabe();
    },

		// Speichert die Aufgabe im ausgewählten Kurs
		saveAufgabe(){
      if(this.aufgabe.bezeichnung != "" && this.aufgabe.aufgabenpfad != "" && this.aufgabe.punkte_max != null){
        var data = {
          bezeichnung: this.kurs.bezeichnung,
          punkte_max: this.aufgabe.punkte_max,
          aufgabenpfad: this.aufgabe.aufgabenpfad,
          kursId: this.aufgabe.kursId
        };
        AufgabeDataService.create(data)
          .then(response => {
            this.aufgabe.id = response.data.id;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
          this.$parent.getKursbyId(this.aufgabe.kursId);
          this.cancel();
        } else{
          alert("Bitte vervollständigen Sie das Formular!");
        }
		},

    flushAufgabe(){
      this.aufgabe.id = null;
      this.aufgabe.bezeichnung = "";
      this.aufgabe.punkte_max = null;
      this.aufgabe.aufgabenpfad = "";
    }
	}
}
</script>

<style scoped>
	.container{
		margin-left: 40px;
	}

  .btn{
    margin-right: 20px;
  }
</style>