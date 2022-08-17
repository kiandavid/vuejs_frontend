<template>
  <div class="auswertung-container">
    <h2>Kursauswertung</h2>

    <!-- Sortier-Optionen -->
    <select v-model="sort" name="Filter" id="sort">
      <option value="-1">Sortiere...</option>
      <option value="0">Alphabetisch</option>
      <option value="3">Nach Punktzahl</option>
    </select><br><br>

    <!-- Liste der Studenten und ihre Aufgaben -->
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
// Services
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
      dataReady: false,
      sort: -1
    }
  },
  methods: {
    /**
     * Holt die Teilnehmer und die Aufgaben des ausgewählten Kurses
     */
    getCourseData(){
      KursDataService.get(this.$store.state.kurs.id)
        .then(res =>{
          this.teilnehmer = res.data.students;
          this.aufgaben = res.data.aufgaben;
        })
    },

    // Index gibt an welcher Wert zurückgeben wird
    // Holt die Werte der letzten drei Spalten für jeden Studenten
    /**
     * gibt die Aufgabeninformationen eines Studenten wieder
     * @param {number} index - 1|2|3 gibt an welche Aufgabeninformation zurückgegeben werden soll 
     * @param {number} studentId - Id des Studenten 
     * @return {number} anzahlAufgaben - index = 1, Anzahl der bearbeiteten Aufgaben
     * @return {string} bewertung - index = 2, Prozentsatz aller erreichten Punkte und aller maximal erreichbaren
     * @return {string} bonus - index = 3, "Ja" | "Nein" gibt an ob die Bonuspunkte erreicht wurden (Grenze bei 60%)
     */
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

    /**
     * Holt alle Lösungen aus der Datenbank und setzt diese lokal
     */
    getAllLoesungen(){
      LoesungDataService.getAll()
        .then(res =>{
          this.loesungen = res.data;
          if(!this.loesungen[0]) {
            alert("Es wurden bisher keine Aufgaben angelegt!");
          } else {
            this.dataReady = true;
          }
        })
        .catch(e => {
          console.log(e);
        })      
    },

    /**
     * Sortiert die Tabelle entweder alphabetisch oder nach der Bewertung
     * @param {number} index, index == 0 für alpha; index == 3 für die Bewertung
     */ 
    sortTable(index) {
      var table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("tabelle");
      switching = true;
      while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TD")[index];
          y = rows[i + 1].getElementsByTagName("TD")[index];
          if(index==0) {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }            
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }    
  },
  /**
   * Beim Aufruf der Seite wird der akutelle Kurs gesetzt
   * Die Aufgaben, Studenten und Lösungen werden aus der Datenbank geholt
   */
  mounted(){
    this.kurs = this.$store.state.kurs;
    this.getCourseData();
    this.getAllLoesungen();
  },
  /**
   * Beobachter für das Attribut sort
   * Bei Änderung von sort wird die Methode
   * sortTable() aufgerufen. Übergeben wird 
   * sort als Index
   */
  watch:{
    sort(){
      if(this.sort>=0){
        this.sortTable(this.sort);
      }
    }
  }
}
</script>

<style>

  .auswertung-container{
    margin-left: 40px;
  }

  
 

</style>