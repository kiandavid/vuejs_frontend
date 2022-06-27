<template>
  <div class="excercise-container">
    <h2>Aufgabe {{id}}</h2>
  </div>
</template>



<script>
export default {
  name: 'ExcerciseViewStud',
  props: ['id']
}
</script> 


<style>

.excercise-container{
  margin-left: 0;
}

</style>


