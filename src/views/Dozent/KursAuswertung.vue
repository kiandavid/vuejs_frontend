<template>
  <div class="auswertung-container">
    <h2>Kursauswertung</h2>

    <select name="Filter" id="sort">
      <option value="sortiere">Sortiere...</option>
    </select><br><br>

    <!-- Kursliste für beide Rollen -->
    <table id="tabelle">
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
        <td>{{getAnzahlAufgaben(pers.id)}} / {{aufgaben.length}}</td>
        <td>{{pers.id}}</td>
        <td></td>
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
      // studenten: [
      //   {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
      //   {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
      //   {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
      //   {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
      // ],
      teilnehmer: [],
      aufgaben: [],
      kurs: {}
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

    getAnzahlAufgaben(studentId){
      let anzahlAufgaben = 0;
      for(let i=0; i < this.aufgaben.length; i++) {
        LoesungDataService.getAll()
          .then(res =>{
            for(let j=0; j < res.data.length; j++){
              // console.log(JSON.stringify(res.data[j],null,2));
              if(res.data[j].studentId == studentId && res.data[j].aufgabeId == this.aufgaben[i].id) {
                anzahlAufgaben++;
              }
            }
            console.log("anz2: "+ anzahlAufgaben);
            return anzahlAufgaben;
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
  
  },
  mounted(){
    this.kurs = this.$store.state.kurs;
    this.getCourseData();
  }
}
</script>

<style>

  .auswertung-container{
    margin-left: 40px;
  }

  
 

</style>