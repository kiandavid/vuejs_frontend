<template>
  <div class="app-container">
    <div class="grid-container" v-if="auth">
      <div class="profil">
        <router-link to="/profil" v-if="userRole!='Master'">
          <img id="userIcon" src="./assets/profil.png" alt="Benutzerlogo">
        </router-link>
      </div>
      <div class="header">
        <h2 id="title">Automatisierte SQL-Bewertung der Hochschule Hannover</h2>
        <button id="logout" @click="logoutFromKeycloak()">Abmelden</button>
      </div>
      <div class="navigation">
        <div class="navItem" v-if="$route.path != '/'">
          <router-link to="/">Kurse</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'courseStud' && user.isStudent">
          <router-link to="/punkte">Punkte</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'courseStud' && !user.isStudent">
          <router-link to="/teilnehmer">Kursteilnehmer</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'courseStud' && !user.isStudent">
          <router-link to="/auswertung">Kursauswertung</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'excerciseStud'">
          <router-link to="/course/1">Kurs</router-link>
        </div>
      </div>
      <div class="content">
          <router-view />
      </div>
    </div>
    <div class="loading_screen" v-if="!auth">
        <img src="./assets/loading.gif" alt="loading" width="80">
    </div>
  </div>
</template>


<script>

// Hier wird die main.js importiert in der die logout-Funktion liegt
import * as main from './main.js'


export default {
  name: 'App',
  data() {
    return {
      user: null,
      userRole: null,
      auth: false,
    }
  },
  methods: {

    // Ruft die keycloak-logout-Methode aus der main.js auf 
    logoutFromKeycloak() {
      this.auth = false;
      main.logout();
    },

    // lokaler User+Userrolle <- store state user (von Keycloak)
    setUser() {
      this.user = this.$store.state.user;
      this.userRole = this.user.realm_access.roles[0];
    }
  },
  // Auth wird hier bestätigt und User auf globalem User gesetzt
  mounted() {  
    this.$store.dispatch('setAuth', true);
    this.auth = this.$store.state.auth;
    setTimeout(() => this.setUser(), 100);
  }
}
</script> 


<style>
body {
  margin: 0;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.loading_screen {
  display: grid;
  justify-content: center;
  margin-top: 42vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin: 0;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.app-container{
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.grid-container {
  margin: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 6fr;
  grid-template-rows: 1fr 8fr;
}

/* Profil */

.profil {
  background-color: #6c757d;
}

#userIcon {
  margin-top: 2vh;
  margin-left: 1vw;
}

/* Überschrift */

.header {
  background-color: #6c757d;
  display: flex;
  justify-content: space-between;
}

#title {
  margin-left: 40px;
  margin-top: 35px;
  text-decoration: underline;
  color: white;
}


h2 {
  margin-left: 40px;
}



#logout {
  margin-right: 40px;
  margin-top: 35px;
  height: 30px;
  width: 100px;
  color: black;
  font-weight: bold;
}

/* Navigation */

.navigation {
  background-color: #565250;
  text-align: center;
}

.navItem {
  padding: 10px;
  border-bottom: 1px black solid;
}

/* Content */

.content {
  background-color: #ffffff;
}


.navigation a {
  font-weight: bold;
  color: white;
}

.navigation a.router-link-exact-active {
  color: #42b983;
}
</style>
