<template>
  <div class="container">
    <div class="course-container">
      <h2 id="course-title">Kurs {{ id }}</h2>
    </div>
    <div class="excercises-container" v-for="aufgabe in aufgaben" :key="aufgabe.id">
      <router-link class="listItem" :to="{ name: 'excerciseStud', params:{ id: aufgabe.id}}">       
        <strong >{{aufgabe.bezeichnung}}</strong>
      </router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CourseViewStud',
  props: ['id'],
  data() {
    return {
      aufgaben: [
        {id: 1, bezeichnung: "Aufgabe 1", Punkte: 5},
        {id: 2, bezeichnung: "Aufgabe 2", Punkte: 5},
        {id: 3, bezeichnung: "Aufgabe 3", Punkte: 5},
        {id: 4, bezeichnung: "Aufgabe 4", Punkte: 5},
        {id: 5, bezeichnung: "Aufgabe 5", Punkte: 5},
        {id: 6, bezeichnung: "Aufgabe 6", Punkte: 5},
        {id: 7, bezeichnung: "Aufgabe 7", Punkte: 5},
      ]
    }
  }
}
</script> 


<style>

.course-container{
  margin-top: 20px;
  margin-left: 40px;
  text-decoration: none;
}

#course-title{
  margin-left: 0px;
  text-decoration: none;
}

.excercises-container{
  margin-left: 40px;
  margin-top: 20px;
}

.listItem{
  text-decoration: none;
  font-size: 24px;
}


</style>

