<template>
  <div> 
    <h2 id="homeTitel">Meine Kurse</h2>

    <!-- Suchfeld der Kurse für Studenten -->
    <div id="kurssuche" v-if="user.isStudent">
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button @click="getCoursebyName()">Suchen</button>
    </div>

    <!-- Wird angezeigt, wenn kein neuer Kurs hinzugefügt wird -->
    <div v-if="submitted">
      <!-- Add Button für Kurse der Dozenten -->
      <div v-if="!user.isStudent">
        <button id="KursBtn" @click="addKurs()">Hinzufügen</button>
      </div>

      <!-- Kursliste für beide Rollen -->
      <div class="courses-container" v-for="kurs in kurse" :key="kurs.id">
        <router-link class="listItem" :to="{ name: 'courseStud', params:{ id: kurs.id}}">
          <strong >{{kurs.bezeichnung}}</strong>
        </router-link>
      </div>
    </div>

    <div v-if="!submitted">
      <div class="form-group">
        <label for="bezeichnung">Bezeichnung:</label><br>
        <input
          type="text"
          class="form-control"
          id="bezeichnung"
          required
          v-model="kurs.bezeichnung"
          name="bezeichnung"
        />
      </div>
      <div class="form-group">
        <label for="semester">Semester:</label><br>
        <input
          class="form-control"
          id="semester"
          required
          v-model="kurs.semester"
          name="semester"
        />
      </div>
      <button @click="saveKurs()" class="btn-success">Speichern</button>
    </div>
    <!-- <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newTutorial">Add</button>
    </div>   -->
  </div>
</template>


<script>
import KursDataService from "../services/KursDataService";
export default {
    name: "HomeView",
    data() {
      return {
        kurse: [
          {"id":1,"bezeichnung":"Joya","semester":"Meech"},
          {"id":2,"bezeichnung":"Wilburt","semester":"Elizabeth"},
          {"id":3,"bezeichnung":"Dora","semester":"McCobb"},
          {"id":4,"bezeichnung":"Elwyn","semester":"Klimek"},
          {"id":5,"bezeichnung":"Polly","semester":"Schriren"}],
        kurs: {
          id: null,
          bezeichnung: "",
          semester: ""
        },
        submitted: true,
        user: {
          name: "Zanjani",
          isStudent: true
        }
      }
    },
    methods: {
      getCoursebyName(){
        console.log("Suche nach Kurs");
      },
      addKurs(){
        this.submitted = false;
        console.log("Füge Kurs hinzu");
      },
      saveKurs(){
        var data = {
          bezeichnung: this.kurs.bezeichnung,
          semester: this.kurs.semester
        };
        KursDataService.create(data)
          .then(response => {
            this.kurs.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch(e => {
            console.log(e);
          });
        this.getAllCourses();
        console.log("Kurs speichern");
        this.submitted = false;
      },
      getAllCourses() {
      KursDataService.getAll()
        .then(response => {
          this.kurse = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      }
    },
    mounted() {
    // this.getAllCourses();
  }
}
</script> 


<style scoped>


.form-group{
  margin-left: 40px;
  margin-bottom: 20px;
}

.btn-success{
  margin-left: 40px;
}

#homeTitel{
  margin-left: 40px;
}

h2{
  margin-left: 40px;
}

#KursBtn{
  margin-left: 40px;
}

.listItem{
  text-decoration: none;
  font-size: 24px;
}


#query{
  margin-left: 40px;
}

.courses-container{
  margin-top: 40px;
  margin-left: 40px;
  text-decoration: none;
}


</style>
