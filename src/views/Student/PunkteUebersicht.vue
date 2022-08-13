<template>
  <div class="punkte-container">
    <h2>Punkteübersicht - {{kurs.bezeichnung}}</h2>
    <h4>Meine Punkte</h4>
    <!-- Aufgabenübersicht des Dozenten -->
    <table class="punkte" v-if="userRole=='Student'">
      <tr>
        <th>Aufgabe</th>
        <th>Status</th>
        <th>Erreichte Punkte</th>
        <th>Bewertung</th>
      </tr>
      <!-- Evtl. dafür auch nochmal ein neues Array erstellen -->
      <tr class="teilnehmer-container" v-for="aufgabe in student.aufgaben" :key="aufgabe.id">
        <td>{{aufgabe.bezeichnung}}</td>
        <td>Wenn es ne Lösung gibt für die Aufgabe von dem Studenten, dann bearbeitet, sonst nicht bearbeitet</td>
        <td>Erreichte Punkte der Lösung / {{aufgabe.punkte}}</td>
        <td>Über computed erreichte/gesamtPunkte</td>
      </tr>
    </table>
  </div>
</template>

<script>
import StudentDataService from '@/services/StudentDataService';

export default {
  props: ["kursId"],
  name: 'PunkteUebersicht',
  data() {
    return {
      kurs: null,
      student: null
    }
  },
  methods: {
    getStudentData(){
      StudentDataService.get(this.$store.state.student.id)
        .then(res => {
          this.student = res.data;
        })
        .catch(e =>{
          console.log(e);
        })
    }
  },
  mounted(){
    this.kurs = this.$store.state.kurs;
    this.getStudentData();
  }
    

    

}
</script>

<style>
.punkte-container{
  margin-left: 40px;
}
</style>