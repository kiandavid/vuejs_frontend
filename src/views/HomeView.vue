<template>
  <div class="home">
    <AppContainer></AppContainer>
  </div>
</template>

<script>
// @ is an alias to /src
import AppContainer from '@/components/AppContainer.vue'

export default {
  name: 'HomeView',
  components: {
    AppContainer
  }
}
</script>
