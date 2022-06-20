<template>
  <div class="container">
      <span>Test</span> 
      <span class="courseField">{{ kurs.Bezeichnung }}</span> 
  </div>
</template>

<script>
export default {
  name: "CourseField",
  data() {
    return {
      kurs: {
        id: 1,
        Bezeichnung: "Datenbank Kurs 1",
        Semester: "SoSe22"
      }
    }
  }
}
</script>

<style>
  .courseField{
    color: black;
  }
</style>