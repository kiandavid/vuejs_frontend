<template>
  <div> 
    <h2>Meine Kurse</h2>
    <form id="form"> 
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button>Suchen</button>
    </form>
      <div class="courses-container" v-for="kurs in kurse" :key="kurs.id">
        <router-link class="listItem" :to="{ name: 'courseStud', params:{ id: kurs.id}}">
          <strong >{{kurs.bezeichnung}}</strong>
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
