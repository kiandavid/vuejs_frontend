<template>
  <div>
    <div class="container" v-if="submittedAdd && submittedUpdate && submittedDelete">
    
      <div class="course-container">
        <h2 id="course-title">{{ kurs.bezeichnung }}</h2>
        <div class="flex-container">
          <div>
            <span> Semester: {{kurs.semester}}</span>
            <div v-for="doz in dozenten" :key="doz.id">
              <span>Dozent: {{doz.titel}} {{doz.nachname}}</span>
            </div>
          </div>
          <div id="ausschreiben" v-if="userRole=='Student'">
            <router-link to="/">
              <strong @click="ausschreiben(kurs.id)">Ausschreiben</strong>
            </router-link>
          </div>
        </div>
        
      </div>
      <div v-if="userRole=='Dozent'">
        <button @click="addAufgabe()">Aufgabe hinzufügen</button>
        <!-- <button @click="test()">download test</button> -->
      </div>

      <div class="excercises-container" v-for="aufgabe in aufgaben" :key="aufgabe.id">
        <div>
          <router-link class="listItem" :to="{ name: 'aufgabe', params:{ id: aufgabe.id, bezeichnung: kurs.bezeichnung, kursId: kurs.id}}">       
            <strong >{{aufgabe.bezeichnung}}</strong>
          </router-link>
        </div>
        <div id="controls" v-if="userRole=='Dozent'">
          <img src="../assets/pen.png" alt="Edit" width="20" @click="update(aufgabe)">&nbsp;
          <img src="../assets/trash.png" alt="Delete" width="20" @click="deleteExcercise(aufgabe)">
        </div> 
      </div>
    </div>

    <PopupAddExcercise  v-if="!submittedAdd"></PopupAddExcercise>
    <PopupUpdateExcercise  v-if="!submittedUpdate"></PopupUpdateExcercise>
    <PopupDeleteExcercise v-if="!submittedDelete"></PopupDeleteExcercise>
  </div>
</template>


<script>
import KursDataService from '@/services/KursDataService';
import AufgabeDataService2 from '@/services/AufgabeDataService2';

import PopupAddExcercise from '@/components/PopupAddExcercise.vue';
import PopupUpdateExcercise from '@/components/PopupUpdateExcercise.vue';
import PopupDeleteExcercise from '@/components/PopupDeleteExcercise.vue';

// import { saveAs } from 'file-saver';

export default {
  name: 'KursSeite',
  props: ['id'],
  components: {
    PopupAddExcercise,
    PopupUpdateExcercise,
    PopupDeleteExcercise
  },
  data() {
    return {
      aufgaben: [],
      dozenten: [],
      kurs: {
        id: this.id,
        bezeichnung: "",
        semester: ""
      },
      userRole: "",
      submittedAdd: true,
      submittedUpdate: true,
      submittedDelete: true,
      currentAufgabe: {}
    }
  },    
  methods: {

    test(){
      AufgabeDataService2.get(this.aufgaben[2].aufgabe)
        .then(res => {
          console.log(res);
        // var blob = new Blob([res.data], {type:'application/zip'});
        // var file = new File([blob], "task.zip", {type: "application/zip"});
        // saveAs(blob, "task.zip");
        })
        .catch(e => {
          console.log(e);
        })
    },

    // Holt die Kursdaten mit den dazugehörigen Aufgaben des Kurses
    getKursById(id){
      KursDataService.get(id)
        .then(response => {
            this.dozenten = response.data.dozents;
            this.aufgaben = response.data.aufgaben;
            this.kurs.bezeichnung = response.data.bezeichnung;
            this.kurs.semester = response.data.semester;
            this.setCurrentKurs();
        })
        .catch(e => {
          console.log(e);
        });
    },

    ausschreiben(kursId){
      KursDataService.delete(kursId, this.$store.state.student.id)
        .catch(e => {
          console.log(e);
        })
    },

    update(aufgabe){
      this.currentAufgabe = aufgabe;
      this.submittedUpdate = false;
    },

    deleteExcercise(aufgabe){
      this.currentAufgabe = aufgabe;
      this.submittedDelete = false;
    },

    setUserRole() {
      this.userRole = this.$store.state.user.realm_access.roles[0];
    },

    addAufgabe(){
        this.submittedAdd = false;
    },

    printAufgaben(){
      console.log(JSON.stringify(this.aufgaben,null,4));
    },

    setCurrentKurs(){
      const currentKurs = {
        "id": this.kurs.id,
        "bezeichnung": this.kurs.bezeichnung,
        "semester": this.kurs.semester,
        "aufgaben": this.aufgaben
      }
      this.$store.dispatch('setKurs', currentKurs);
    }
  },
  mounted() {
    console.log("Mounted");
    this.setUserRole();
    this.getKursById(this.kurs.id);
  },
  watch: {
    aufgaben(){
      this.getKursById(this.kurs.id);
    }
  }
}
</script> 


<style>

.container{
  margin-left: 40px;
}

.course-container{
  margin-top: 20px;
  margin-bottom: 20px;
  text-decoration: none;
}

#course-title{
  margin-left: 0px;
  text-decoration: none;
}

.excercises-container{
  margin-top: 20px;
}

.listItem{
  text-decoration: none;
  font-size: 24px;
}

#controls{
  margin-right: 800px;
}

.excercises-container{
  margin-top: 40px;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
}

.flex-container{
  display: flex;
  justify-content: space-between;
}

#ausschreiben{
  margin-right: 200px;
}

</style>

