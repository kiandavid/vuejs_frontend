<template>
  <div class="punkte-container" v-if="userRole=='Student' && dataLoaded">
    <h2>Punkteübersicht - {{kurs.bezeichnung}}</h2>
    <h3>Meine Punkte</h3>
    <table class="punkte">
      <tr>
        <th>Aufgabe</th>
        <th>Status</th>
        <th>Erreichte Punkte</th>
        <th>Bewertung</th>
      </tr>
      <!-- Evtl. dafür auch nochmal ein neues Array erstellen -->
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
// import StudentDataService from '@/services/StudentDataService';
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
  
    getBewertung(erreicht, maximum){
      var punkte = Number(erreicht);
      var punkte_max = Number(maximum);
      var bewertung = Math.round((punkte/punkte_max)*100);
      return bewertung + "%";
    }
  },
  mounted(){
    this.kurs = this.$store.state.kurs;
    this.userRole = this.$store.state.user.realm_access.roles[0];
    this.student = this.$store.state.student;
    this.aufgaben = this.kurs.aufgaben;
    // console.log(JSON.stringify(this.aufgaben,null,2));
    this.getStatus();
  }
    

    

}
</script>

<style>
.punkte-container{
  margin-left: 40px;
}
</style>