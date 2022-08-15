<template>
  <div class="teilnehmer-container">
    <div v-if="submittedRemove">
      <h2>Kursteilnehmer</h2>

      <button @click="addTeilnehmer()">Hinzufügen</button><br><br>

      <!-- Kursliste für beide Rollen -->
      <table id="tabelle">
        <tr>
          <th>Student</th>
          <th>Matrikelnummer</th>
          <th>Studiengang</th>
          <th>Aktion</th>
        </tr>
        <tr class="teilnehmer-container" v-for="pers in teilnehmer" :key="pers.id">
          <td>{{pers.vorname}} {{pers.name}}</td>
          <td>{{pers.matrikelnummer}}</td>
          <td>{{pers.studiengang}}</td>
          <td><img src="@/assets/trash.png" alt="Delete" width="20" @click="removeTeilnehmer(pers)"></td>
        </tr>
      </table>
    </div>
    <PopupRemoveTeilnehmer v-if="!submittedRemove"></PopupRemoveTeilnehmer>
  </div>
</template>

<script>
import KursDataService from '@/services/KursDataService';

import PopupRemoveTeilnehmer from '@/components/PopupRemoveTeilnehmer.vue';

export default {
  name: 'KursTeilnehmer',
  components: {
    PopupRemoveTeilnehmer
  },
  data() {
    return {
      teilnehmer: [],
      submittedAdd: true,
      submittedRemove: true,
      currentStudent: {}
    }
  },
  methods: {
    addTeilnehmer(){
      console.log("Teilnehmer hinzufügen");
      // Popup öffnen -> Suche nach Email + Anzeige, wenn gefunden nach Bestätigung fragen und dann Kurs.addStudent
    },

    getTeilnehmer(){
      KursDataService.get(this.$store.state.kurs.id)
        .then(res =>{
          this.teilnehmer = res.data.students;
          // console.log(JSON.stringify(this.teilnehmer,null,4));
        })
    },

    removeTeilnehmer(student){
      this.currentStudent = student;
      this.submittedRemove = false;
      // Popup öffnen -> nach Bestätigung fragen und dann Kurs.removeStudent
    }

  },
  mounted(){
    this.getTeilnehmer();
  },
  watch: {
    teilnehmer(){
      this.getTeilnehmer();
    }
  }
}
</script>

<style>


  .teilnehmer-container{
    margin-left: 40px;
  }

  img{
    cursor: pointer;
  }

</style>