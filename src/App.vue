<template>
  <div class="app-container">
    <div class="grid-container">
      <div class="profil">
        <router-link to="/profil">
          <img id="userIcon" src="./assets/profil.png" alt="Benutzerlogo">
        </router-link>
      </div>
      <div class="header">
        <h2 id="title">Automatisierte SQL-Bewertung der Hochschule Hannover</h2>
        <!-- Methodenaufruf der Logout-Methode der main.js -->
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
        <div class="navItem" style="color:white">
          <button @click="getRole()">Rolle</button>
        </div>
        <div class="navItem" style="color:white">
          <button @click="setUser()">Set</button>
        </div>
        <div class="navItem" style="color:white">
          Benutzerrolle: {{auth}}
        </div>
        <!-- tutorial -->
        <!-- <div class="navItem">
          <router-link to="/tutorials">Tutorials</router-link>
        </div>
        <div class="navItem">
          <router-link to="/add">Add</router-link>
        </div> -->

      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
    <!-- <div class="loadling_screen" v-if="!auth">
        <img src="../assets/loading.gif" alt="loading" width="80">
    </div> -->
  </div>
</template>


<script>

// Hier wird die main.js importiert in der die logout-Funktion liegt
// import * as main from './main.js'

// unter Methods wird die logout-Methode aufgerufen
export default {
  name: 'App',
  data() {
    return {
      user: {
        name: "Zanjani",
        isStudent: false,
        role: "Dozent"
      },
      auth: this.$store.state.auth
    }
  },
  methods: {
    logoutFromKeycloak() {
      // main.logout();
    },
    getRole(){
      // this.user.role = main.getUserRole();
      console.log("User:"+JSON.stringify(this.$store.state.user,null,4));
      console.log("UserRole:"+this.$store.state.userRole);
      console.log("Auth:"+this.$store.state.auth);
    },
    setUser(){
      this.$store.dispatch('setUser', this.user);
      this.$store.dispatch('setUserRole', this.user.role);
      this.$store.dispatch('setAuth', true);
      console.log("Set");
    }
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
