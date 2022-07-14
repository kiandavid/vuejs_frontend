<template>
  <div class="teilnehmer-container">
    <h2>Kursteilnehmer</h2>

    <button @click="addTeilnehmer()">Hinzufügen</button><br><br>

    <!-- Kursliste für beide Rollen -->
    <table id="tabelle">
      <tr>
        <th>Student</th>
        <th>Matrikelnummer</th>
        <th>Studiengang</th>
      </tr>
      <tr class="teilnehmer-container" v-for="pers in teilnehmer" :key="pers.id">
        <td>{{pers.vorname}} {{pers.name}}</td>
        <td>{{pers.matrikelnummer}}</td>
        <td>{{pers.studiengang}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'KursTeilnehmer',
  data() {
    return {
      teilnehmer: [
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, studiengang: "Angwandte Informatik"},
        {id: 2, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, studiengang: "Angwandte Informatik"},
        {id: 3, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, studiengang: "Angwandte Informatik"},
        {id: 4, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, studiengang: "Angwandte Informatik"}
      ]
    }
  },
  methods: {
    addTeilnehmer(){
      console.log("Teilnehmer hinzufügen");
    }
  } 
}
</script>

<style>


  .teilnehmer-container{
    margin-left: 40px;
  }

  /* #tabelle{
  } */

</style>