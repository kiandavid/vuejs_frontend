<template>
  <div class="punkte-container" v-if="userRole=='Student' && dataLoaded">
  <!-- Übersicht der Punkte eines Kurses -->
    <h2>Punkteübersicht - {{kurs.bezeichnung}}</h2>
    <h3>Meine Punkte</h3>
    <table class="punkte">
      <tr>
        <th>Aufgabe</th>
        <th>Status</th>
        <th>Erreichte Punkte</th>
        <th>Bewertung</th>
      </tr>
      <tr class="teilnehmer-container" v-for="(aufgabe, index) in aufgaben" :key="aufgabe.id">
        <td>{{aufgabe.bezeichnung}}</td>
        <td>{{status[index]}}</td>
        <td>{{punkte_erreicht[index]}} / {{aufgabe.punkte_max}}</td>
        <td>{{getBewertung(punkte_erreicht[index], aufgabe.punkte_max)}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
// Service
import LoesungDataService from '@/services/LoesungDataService';

export default {
  props: ["kursId"],
  name: 'PunkteUebersicht',
  data() {
    return {
      kurs: null,
      student: null,
      dataLoaded: false,
      userRole: "",
      aufgaben: [],
      status: [],
      punkte_erreicht: []
    }
  },
  methods: {
    /**
     * Prüft den Abgabestatus für jede Aufgabe und speichert die erreichten Punkte
     * für jede Aufgabe in einem Array
     */
    getStatus(){
      for(let i=0; i < this.aufgaben.length; i++){
        LoesungDataService.getAll()
          .then(res =>{
            let loesungen = res.data;
            for(let j=0; j < loesungen.length; j++){
              if(loesungen[j].aufgabeId == this.aufgaben[i].id && loesungen[j].studentId == this.student.id) {
                this.status[i] = "Abgegeben";
                var temp = Math.round(loesungen[j].punkte*100);
                this.punkte_erreicht[i] = temp/100;
              }               
            }
            if(!this.status[i]) {
              this.status[i] = "Nicht abgegeben";
              this.punkte_erreicht[i] = 0;
            } 
          })
          .catch(e =>{
            console.log(e);
          })
        this.dataLoaded = true;
      }
    },
  
    /**
     * Berechnet die Bewertung für jede Aufgabe anhand der übergebenen Paramter
     * @param {string} punkteErreicht - Die erreichten Punkte einer Lösung
     * @param {string} punkteMaximum - Die maximal erreichbaren Punkte einer Aufgabe
     * @return {string} bewertung - Prozentsatz: punkteErreicht / punkteMaximum
     */
    getBewertung(punkteErreicht, punkteMaximum){
      var punkte = Number(punkteErreicht);
      var punkte_max = Number(punkteMaximum);
      var bewertung = Math.round((punkte/punkte_max)*100);
      return bewertung + "%";
    }
  },
  /**
   * Beim Aufruf der Seite wird der Kurs, die Benutzerolle, das Student-Objekt und
   * die Aufgaben des Kurses aus dem globalen Speicher geholt. zuletzt wird der Status
   * abgeholt. 
   */
  mounted(){
    this.kurs = this.$store.state.kurs;
    this.userRole = this.$store.state.user.realm_access.roles[0];
    this.student = this.$store.state.student;
    this.aufgaben = this.kurs.aufgaben;
    this.getStatus();
  }
    

    

}
</script>

<style>
.punkte-container{
  margin-left: 40px;
}
</style>