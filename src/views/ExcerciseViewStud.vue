<template>
  <div class="excercise-container">
    <h2>Aufgabe {{id}}</h2>

    <strong id="aufgabe">Aufgabenstellung:</strong><br>
    <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</span><br><br>


    <!-- Aufgabenübersicht des Dozenten -->
    <table id="tabelleAufgabe" v-if="!user.isStudent">
      <tr>
        <th>Student</th>
        <th>Matrikelnummer</th>
        <th>Status</th>
        <th>Erreichte Punkte</th>
      </tr>
      <tr class="teilnehmer-container" v-for="pers in studenten" :key="pers.id">
        <td>{{pers.vorname}} {{pers.name}}</td>
        <td>{{pers.matrikelnummer}}</td>
        <td>{{pers.status}}</td>
        <td>{{pers.punkte}}</td>
      </tr>
    </table>

    <!-- Sicht der Studenten -->
    <div v-if="user.isStudent">
      <table id="AufgabenDetails">
          <tr>
            <th>Begonnen am</th>
            <td>Datum1</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>Abgegeben</td>
          </tr>
          <tr>
            <th>Beendet am</th>
            <td>Datum 2</td>
          </tr>
          <tr>
            <th>Verbrauchte Zeit</th>
            <td>5 Tage</td>
          </tr>
          <tr>
            <th>Punkte</th>
            <td>5.50/7.00</td>
          </tr>
          <tr>
            <th>Bewertung</th>
            <td>79.5%</td>
          </tr>
      </table>

      <h3>Lösung einreichen</h3>
      <input type="file"><br><br>
      <router-link to="/feedback">Feedback einsehen</router-link>

    </div>
  </div>
</template>



<script>
export default {
  name: 'ExcerciseViewStud',
  props: ['id'],
  data() {
    return {
      studenten: [
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"},
        {id: 1, vorname: 'Max', name:'Mustermann', matrikelnummer: 111111, status: "Bearbeitet", punkte: "5.0/7.0"}
      ],
      user: {
        name: "Zanjani",
        isStudent: false
      }
    }
  }
}
</script> 


<style>

#aufgabe{
  text-decoration: underline;
}

#tabelleAufgabe{
  margin-left: 0px;
}

.excercise-container{
  margin-left: 40px;
}

h2{
  margin-left: 0px;
}

</style>


