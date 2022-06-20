<template>
  <div class="grid-container">
    <div class="profil">
      <img id="userIcon" src="./assets/profil.png" alt="Benutzerlogo">
    </div>
    <div class="header">
      <h2>Automatisierte SQL-Bewertung der Hochschule Hannover</h2>
      <button id="logout">Abmelden</button>
    </div>
    <div class="navigation">
      <div class="navItem">
        <router-link to="/">Home</router-link>
      </div>
      <div class="navItem">
        <router-link to="/course">Kurs</router-link>
      </div>
      <div class="navItem">
        <router-link to="/excercise">Aufgabe</router-link>
      </div>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>


<script>
export default {
  name: 'App',
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

.grid-container{
  margin: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 6fr;
  grid-template-rows: 1fr 8fr;
}

/* Profil */

.profil{
  background-color: #6c757d;
}

#userIcon{
  margin-top: 2vh;
  margin-left: 1vw;
}

/* Überschrift */

.header{
  background-color: #6c757d;
  display: flex;
  justify-content: space-between;
}

h2 {
  margin-left: 40px;
  margin-top: 35px;
  text-decoration: underline;
}

#logout {
  margin-right: 40px;
  margin-top: 35px;
  height: 30px;
  width: 100px;
}

/* Navigation */

.navigation{
  background-color: #565250;
  text-align: center;
}

.navItem{
  padding: 10px;
  border-bottom: 1px black solid;
}

/* Content */

.content{
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
