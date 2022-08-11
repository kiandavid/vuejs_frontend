<template>
  <div>
    <div class="bewertungsaspekt-container">
      <div class="first-feedback" @click="toggleFeedback">{{ bewertungsaspekt.typ }}</div>
      <div id="feedback-wrapper-2">
        <div class="feedback-container" v-for="feedback in feedbacks" :key="feedback.id">
          {{ feedback.anmerkung }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackDetail',
  data() {
    return {
      bewertungsaspekt: {
        id: 1,
        typ: "Kostenprüfung",
        punkte: 1
      },
      feedbacks: [
        { id: 1, anmerkung: "Kosten ihres Statements: 3.0." },
        { id: 2, anmerkung: "Absolute Kostenobergrenze ist: 2000." },
        { id: 3, anmerkung: "Kosten der Musterlösung: 3.0." },
        { id: 4, anmerkung: "Die Kosten der Abfrage sollte kleiner als 30.0 sein." },
        { id: 5, anmerkung: "Die Kosten der Anfrage sind okay." }
      ]
    }
  },
    toggleFeedback() {
      var x = document.getElementById("feedback-wrapper-2");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
}
</script>

<style scoped>

.first-feedback {
  border-style: solid;
  border-width: 2px;
  background-color: bisque;
  /* margin: 40px; */
  margin-bottom: 0;
  width: 40%;
  cursor: pointer;
}

.bewertungsaspekt-container{
  margin-top: 20px;
}

.feedback-container {
  border-style: solid;
  border-width: 2px;
  margin-bottom: 1px;
  margin-left: 0px;
  margin-top: 1px;
  width: 40%;
}

</style>
