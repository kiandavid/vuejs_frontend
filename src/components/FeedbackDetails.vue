<template>
  <div>
    <div class="bewertungsaspekt-container" v-if="feedbackReady" >
      <div class="first-feedback">{{ bewertungsaspekte[index].typ }}</div>
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
    setAspekt(){
      this.bewertungsaspekte = this.$parent.bewertungsaspekte;
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
