<template>
  <div>
    <div class="container" v-if="submittedAdd">
    
      <div class="course-container">
        <h2 id="course-title">{{ kurs.bezeichnung }}</h2>
        <span> Semester: {{kurs.semester}}</span>
      </div>
      <div v-if="userRole=='Dozent'">
        <button @click="addAufgabe()">Aufgabe hinzufügen</button>
      </div>

      <div class="excercises-container" v-for="aufgabe in aufgaben" :key="aufgabe.id">
        <router-link class="listItem" :to="{ name: 'excerciseStud', params:{ id: aufgabe.id}}">       
          <strong >{{aufgabe.bezeichnung}}</strong>
        </router-link>
      </div>
    </div>

    <PopupAddExcercise/>

  </div>
</template>


<script>
import KursDataService from '@/services/KursDataService';

import PopupAddExcercise from '@/components/PopupAddExcercise.vue';

export default {
  name: 'CourseViewStud',
  props: ['id'],
  components: {
    PopupAddExcercise
  },
  data() {
    return {
      aufgaben: [],
      kurs: {
        id: this.id,
        bezeichnung: "",
        semester: ""
      },
      userRole: "",
      submittedAdd: true
    }
  },    
  methods: {

    // Holt die Kursdaten mit den dazugehörigen Aufgaben des Kurses
    getKursById(id){
      KursDataService.get(id)
        .then(response => {
            this.aufgaben = response.data.aufgaben;
            this.kurs.bezeichnung = response.data.bezeichnung;
            this.kurs.semester = response.data.semester;
        })
        .catch(e => {
          console.log(e);
        });
    },

    setUserRole() {
      this.userRole = this.$store.state.user.realm_access.roles[0];
    },

    addAufgabe(){
        this.submittedAdd = false;
    }
  },
  mounted() {
    console.log("Mounted");
    this.getKursById(this.kurs.id);
    this.setUserRole();
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


</style>

