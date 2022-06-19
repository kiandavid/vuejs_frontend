<template>
  <div class="grid-container">
    <div class="profil">
      Profil
    </div>
    <div class="header">
      header
    </div>
    <div class="navigation">
      Navigation
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div class="content">
      Content
      <router-view/>
    </div>
  </div>


</template>

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
  /* grid-template-areas: 
  "header" "header"
  "nav" "contento"
  "footer" "footer"; */
  gap: 10px;
}

.header{
  /* grid-area: header; */
  background-color: red;
}

.navigation {
  /* grid-area: navigation; */
  background-color: blue;

}

.content{
  /* grid-area: contento; */
  background-color: green;

}

.profil{
  /* grid-area: footer; */
  background-color: yellow;

}

.navigation a {
  font-weight: bold;
  color: #2c3e50;
}

.navigation a.router-link-exact-active {
  color: #42b983;
}
</style>
