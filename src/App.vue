<template>
  <div class="app-container">
    <div class="grid-container" v-if="auth">
    <!-- Profil-Icon -->
      <div class="profil">
        <router-link to="/profil" v-if="userRole!='Master'">
          <img id="userIcon" src="./assets/profil.png" alt="Benutzerlogo">
        </router-link>
      </div>
      <!-- Header mit Titel und Abmelde-Button -->
      <div class="header">
        <h2 id="title">Automatisierte SQL-Bewertung der Hochschule Hannover</h2>
        <button id="logout" @click="logoutFromKeycloak()">Abmelden</button>
      </div>
      <!-- Navigationsleiste -->
      <div class="navigation">
        <div class="navItem" v-if="$route.path != '/'">
          <router-link to="/">Kurse</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'kurs' && userRole=='Student'">
          <router-link to="/punkte">Punkte</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'kurs' && userRole=='Dozent'">
          <router-link to="/teilnehmer">Kursteilnehmer</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'kurs' && userRole=='Dozent'">
          <router-link to="/auswertung">Kursauswertung</router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'aufgabe'">
          <router-link :to="{ name: 'kurs', params:{ id: this.$store.state.kurs.id }}">
            {{getKursName()}}
          </router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'PunkteStud'">
          <router-link :to="{ name: 'kurs', params:{ id: this.$store.state.kurs.id }}">
            {{getKursName()}}
          </router-link>
        </div>        
        <div class="navItem" v-if="$route.name == 'FeedbackStud'">
          <router-link :to="{ name: 'kurs', params:{ id: this.$store.state.kurs.id }}">
            {{getKursName()}}
          </router-link>
        </div>
        <div class="navItem" v-if="$route.name == 'TeilnehmerDoz'">
          <router-link :to="{ name: 'kurs', params:{ id: this.$store.state.kurs.id }}">
            {{getKursName()}}
          </router-link>
        </div>        
        <div class="navItem" v-if="$route.name == 'AuswertungDoz'">
          <router-link :to="{ name: 'kurs', params:{ id: this.$store.state.kurs.id }}">
            {{getKursName()}}
          </router-link>
        </div>                    
      </div>
      <!-- Content-Fenster in das alle anderen Seiten gerendert werden -->
      <div class="content">
          <router-view />
      </div>
    </div>
    <!-- Nach Abmeldung wird ein Loading Screen angezeigt, bis die Keycloak-Fenster geladen sind -->
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
      auth: false
    }
  },
  methods: {

  
    /**
     * Setzt den Bool-Wert auth auf falsch, damit der Loading-Screen angezeigt wrid
     * Danach wird die keycloak-logout-Methode aus main.js aufgerufen 
     */
    logoutFromKeycloak() {
      this.auth = false;
      main.logout();
    },

    /**
       * Das User-Objekt aus dem State (Keycloak-Access token) wird genutzt um 
       * den Benutzer und seine Rolle lokal zu speichern.
       */
    setUser() {
      this.user = this.$store.state.user;
      this.userRole = this.user.realm_access.roles[0];
    },

    /**
     * Für die RouterLinks in der Navigationsleiste wird eine Route benötigt
     * Diese wird für den aktuell ausgewählten Kurs zurückgegeben
     * Der aktuelle Kurs ist im globalen Speicher (state) gespeichert
     * @return {string} route - Route zum Kurs
     */
    getKursRoute(){
      var kurs = this.$store.state.kurs;
      return "kurs/"+kurs.id;
    },

    /**
     * In der Navigationsleiste wird der Name des Kurses benötigt
     * Dieser wird für den aktuell ausgewählten Kurs zurückgegeben
     * @return {string} kurs.bezeichnung - Route zum Kurs
     */
    getKursName(){
      var kurs = this.$store.state.kurs;
      return kurs.bezeichnung;
    }

  },
  /**
   * Beim Aufruf der Anwendung wird der Bool-Wert auf wahr gesetzt und im State gepsiechert
   * Danach wird die Methode zum Setzen des Benutzers um 0,1 Sekunden verzögert aufgerufen.
   * Diese Verzögerung ist nötig, da der Keycloak-Access-token noch nicht im State gespeichert ist,
   * wenn der mounted-hook aufgerufen wird. 
   */
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

button{
  cursor: pointer;
}

img{
  cursor: pointer;
}
</style>
