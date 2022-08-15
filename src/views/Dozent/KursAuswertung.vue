<template>
  <div class="auswertung-container">
    <h2>Kursauswertung</h2>

    <select name="Filter" id="sort">
      <option value="sortiere">Sortiere...</option>
    </select><br><br>

    <table id="tabelle" v-if="dataReady">
      <tr>
        <th>Student</th>
        <th>Matrikelnummer</th>
        <th>Anzahl der bearbeitenden Aufgaben</th>
        <th>Erreichte Punkte (%)</th>
        <th>Bonuspunkte (60%)</th>
      </tr>
      <tr class="teilnehmer-container" v-for="pers in teilnehmer" :key="pers.id">
        <td>{{pers.vorname}} {{pers.nachname}}</td>
        <td>{{pers.matrikelnummer}}</td>
        <td>{{getAufgabenInfo(1, pers.id)}} / {{aufgaben.length}}</td>
        <td>{{getAufgabenInfo(2, pers.id)}}</td>
        <td>{{getAufgabenInfo(3, pers.id)}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import KursDataService from '@/services/KursDataService';
import LoesungDataService from '@/services/LoesungDataService';

export default {
  name: 'KursAuswertung',
  data() {
    return {
      teilnehmer: [],
      aufgaben: [],
      kurs: {},
      loesungen: [],
      dataReady: false
    }
  },
  methods: {
    getCourseData(){
      KursDataService.get(this.$store.state.kurs.id)
        .then(res =>{
          this.teilnehmer = res.data.students;
          this.aufgaben = res.data.aufgaben;
          // console.log(JSON.stringify(this.aufgaben,null,4));
        })
    },

    // Index gibt an welcher Wert zurückgeben wird
    // Holt die Werte der letzten drei Spalten für jeden Studenten
    getAufgabenInfo(index, studentId){
      let anzahlAufgaben = 0;
      let punkteMaxGesamt = 0;
      let punkteErreichtGesamt = 0;
      for(let i=0; i < this.aufgaben.length; i++) {
        punkteMaxGesamt += Number(this.aufgaben[i].punkte_max);
        for(let j=0; j < this.loesungen.length; j++){
          if(this.loesungen[j].studentId == studentId && this.loesungen[j].aufgabeId == this.aufgaben[i].id) {
            anzahlAufgaben++;
            punkteErreichtGesamt += Number(this.loesungen[j].punkte);
          }
        }
      }
      let punkteErr = Math.round(punkteErreichtGesamt*100);
      let bewertung = Math.round(((punkteErr/100)/punkteMaxGesamt)*100);
      let bonus = "Nein";
      if(bewertung >= 60) {
        bonus = "Ja";
      }
      
      switch(index){
        case 1:
          return anzahlAufgaben;
        case 2:
          return bewertung+"%";
        case 3: 
          return bonus;
      }
    },

    getAllLoesungen(){
      LoesungDataService.getAll()
        .then(res =>{
          this.loesungen = res.data;
          this.dataReady = true;
        })
        .catch(e => {
          console.log(e);
        })      
    }
  
  },
  mounted(){
    this.kurs = this.$store.state.kurs;
    this.getCourseData();
    this.getAllLoesungen();
  }
}
</script>

<style>

  .auswertung-container{
    margin-left: 40px;
  }

  
 

</style>