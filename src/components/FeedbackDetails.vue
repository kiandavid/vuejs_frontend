<template>
  <div>
    <!-- Sobald das neue Array im Parent erstellt wurde, werden dessen Daten hier angezeigt -->
    <div class="bewertungsaspekt-container" v-if="feedbackReady">
      <!-- Info über den Bewertungsaspekt -->
      <div class="first-feedback">
        <div>Bewertungsaspekt: {{ bewertungsaspekte[index].typ }}</div>
        <div>Punkte: {{bewertungsaspekte[index].punkte}}</div>
      </div>
      <!-- Container für die Anmerkungen -->
      <div id="feedback_wrapper">
        <div class="feedback-container" v-for="feedback in bewertungsaspekte[index].anmerkungen" :key="feedback.id">
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
      bewertungsaspekte: "",
      feedbackReady: false
    }
  },
  methods: {
    /**
     * Das Array der Bewertungsaspekte wird vom Parent übernommen
     * Vom Parent wird der Index als prop übergeben
     * Somit wird ein Bewertungsaspekt im Array ausgewäht
     */
    setAspekt(){
      this.bewertungsaspekte = this.$parent.bewertungsaspekte;
    }
  },
  watch: {
    /**
     * ein Beobachter der das Bewertungsaspekt-Array setzt, 
     * sobald die Variable feedbackReady vom Parent geändert wird
     */
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
  display: flex;
  justify-content: space-between;
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
