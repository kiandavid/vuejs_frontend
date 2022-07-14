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
      <tr class="teilnehmer-container" v-for="pers in studenten" :key="pers.id">
        <td class="nameCell">{{pers.vorname}} {{pers.name}}</td>
        <td>{{pers.matrikelnummer}}</td>
        <td>{{pers.studiengang}}</td>
        <td>{{pers.anzahl}}</td>
        <td>{{pers.punkte}}</td>
        <td>{{pers.bonus}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'KursAuswertung',
  data() {
    return {
      studenten: [
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, anzahl: "9/10", punkte: "87%", bonus: "Ja"},
      ]
    }
  },
}
</script>

<style>

  .auswertung-container{
    margin-left: 40px;
  }

  
 

</style>