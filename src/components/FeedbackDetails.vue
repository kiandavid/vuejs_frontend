<template>
  <div>
    <div class="bewertungsaspekt-container">
      <div class="first-feedback">{{ bewertungsaspekt.typ }}</div><button @click="setAspekt()">Feedback</button>
      <div id="feedback_wrapper">
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
  props: ["index"],
  data() {
    return {
      bewertungsaspekt: {
        typ: "",
        punkte: null
      },
      anmerkungen: [
        { id: 1, anmerkung: "Kosten ihres Statements: 3.0." },
        { id: 2, anmerkung: "Absolute Kostenobergrenze ist: 2000." },
        { id: 3, anmerkung: "Kosten der Musterlösung: 3.0." },
        { id: 4, anmerkung: "Die Kosten der Abfrage sollte kleiner als 30.0 sein." },
        { id: 5, anmerkung: "Die Kosten der Anfrage sind okay." }
      ],
      feedbackReady: false
    }
  },
  methods: {
    setAspekt(){
      // var data = this.$parent.feedbackJSON[this.index];
      console.log(JSON.stringify(this.$parent.feedbackJSON));
      // this.bewertungsaspekt.typ = data._attributes.id;
      // this.bewertungsaspekt.punkte = data["test-result"]["result"]["score"]["_text"];
    }
  },
  watch: {
    feedbackReady(){
      this.setAspekt();
    }
  }
}
</script>

<style scoped>

.first-feedback {
  border-style: solid;
  border-width: 2px;
  background-color: bisque;
  margin-bottom: 0;
  width: 80%;
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
  width: 80%;
}

</style>
