<template>
  <div> 
    <h2>Meine Kurse</h2>
    <form id="form"> 
      <input type="search" id="query" placeholder="Kurs suchen...">
      <button>Suchen</button>
    </form>
    <div class="courseContainer">
      <CourseField/>
    </div>
  </div>
</template>


<script>


import CourseField from '../components/CourseField.vue'

export default {
    name: "HomeViewStud",
    components: { 
      CourseField
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
