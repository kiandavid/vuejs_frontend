<template>
  <div> 
    <h2 id="homeTitel">Meine Kurse</h2>

    <!-- Suchfeld der Kurse für Studenten -->
    <div id="kurssuche" v-if="user.isStudent">
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button @click="getCoursebyName()">Suchen</button>
    </div>

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
</template>


<script>


export default {
    name: "HomeView",
    data() {
      return {
        kurse: [
          {id: 1, bezeichnung: "Datenbank Kurs 1", semester: "SoSe22"},
          {id: 2, bezeichnung: "Datenbank Kurs 2", semester: "SoSe22"},
          {id: 3, bezeichnung: "Datenbank Kurs 3", semester: "WiSe22/23"}
        ],
        user: {
          name: "Zanjani",
          isStudent: false
        }
      }
    },
    methods: {
      getCoursebyName(){
        console.log("Suche nach Kurs");
      },
      addKurs(){
        console.log("Füge Kurs hinzu");
      }
    }
}
</script> 


<style>

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
