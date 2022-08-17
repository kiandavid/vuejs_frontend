<template>
  <div class="teilnehmer-container">
    <div v-if="submittedRemove && submittedAdd">
      <h2>Kursteilnehmer</h2>
      <!-- Button zum Hinzufügen neuer Teilnehmer -->
      <button @click="addTeilnehmer()">Hinzufügen</button><br><br>
      <!-- Übersicht der Kursteilnehmer -->
      <table id="tabelle">
        <tr>
          <th>Student</th>
          <th>Matrikelnummer</th>
          <th>Studiengang</th>
          <th>Aktion</th>
        </tr>
        <tr class="teilnehmer-container" v-for="pers in teilnehmer" :key="pers.id">
          <td>{{pers.vorname}} {{pers.nachname}}</td>
          <td>{{pers.matrikelnummer}}</td>
          <td>{{pers.studiengang}}</td>
          <!-- Icon zum Aufruf des Entfernen-Popups -->
          <td><img src="@/assets/trash.png" alt="Delete" width="20" @click="removeTeilnehmer(pers)"></td>
        </tr>
      </table>
    </div>
    <!-- Popup-SFCs für das Entfernen und Hinzufügen von Teilnehmern -->
    <PopupRemoveTeilnehmer v-if="!submittedRemove"></PopupRemoveTeilnehmer>
    <PopupAddTeilnehmer v-if="!submittedAdd"></PopupAddTeilnehmer>
  </div>
</template>

<script>
// Services
import KursDataService from '@/services/KursDataService';

// SFCs
import PopupRemoveTeilnehmer from '@/components/PopupRemoveTeilnehmer.vue';
import PopupAddTeilnehmer from '@/components/PopupAddTeilnehmer.vue';

export default {
  name: 'KursTeilnehmer',
  components: {
    PopupRemoveTeilnehmer,
    PopupAddTeilnehmer
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
    /**
     * Öffnet das Popup-Fenster zum Hinzufügen 
     */
    addTeilnehmer(){
      this.submittedAdd = false;
    },

    /**
     * Holt alle Teilnehmer des Kurses aus der Datenbank
     */
    getTeilnehmer(){
      KursDataService.get(this.$store.state.kurs.id)
        .then(res =>{
          this.teilnehmer = res.data.students;
        })
    },

    /**
     * Öffnet das Popup-Fenster zum Entfernen eines Teilnehmers
     */
    removeTeilnehmer(student){
      this.currentStudent = student;
      this.submittedRemove = false;
    }

  },
  /**
   * Beim Aufruf der Seite werden die Teilnehmer aus der Datenbank geholt
   */
  mounted(){
    this.getTeilnehmer();
  },
  /**
   * Ändert sich der Wert der teilnehmer-Variable, werden die Teilnehmer neu
   * aus der Datenbank geholt
   */
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