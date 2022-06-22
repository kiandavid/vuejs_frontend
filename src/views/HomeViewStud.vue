<template>
  <div> 
    <h2>Meine Kurse</h2>
    <form id="form"> 
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button>Suchen</button>
    </form>
    <div v-for="kurs in kurse" :key="kurs.id">
      <router-link :to="{ name: 'courseStud', params:{ id: kurs.id}}">
        <h2>{{kurs.bezeichnung}}</h2>
      </router-link>
    </div>
  </div>
</template>


<script>


export default {
    name: "HomeViewStud",
    data() {
      return {
        kurse: [
          {id: 1, bezeichnung: "Datenbank Kurs 1", semester: "SoSe22"},
          {id: 2, bezeichnung: "Datenbank Kurs 2", semester: "SoSe22"},
          {id: 3, bezeichnung: "Datenbank Kurs 3", semester: "WiSe22/23"}
        ]
      }
    }
}
</script> 


<style>

#query{
  margin-left: 40px;
}

.course-container{
  margin-left: 40px;
  margin-top: 40px;
}

</style>
