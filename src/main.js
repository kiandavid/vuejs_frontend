import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import Keycloak from 'keycloak-js'

// Methode zum Starten der Vue App
function instantiateVueApp() {
    createApp(App)
        .use(router)
        .mount('#app')
}

instantiateVueApp();

// export function logout() {
//     console.log("Logout tried");
//     keycloak.logout(logoutOptions).then((success) => {
//         console.log("Logout success: " + success);
//     }).catch((error) => {
//         console.log("Logout error: ", error);
//     });
// }

// // Redirect Link für Logout
// var logoutOptions = { redirectUri: 'http://localhost:8081/' };


// // Konfig Daten für Keycloak
// let initOptions = {
//     url: 'http://localhost:8080/', realm: 'Grader', clientId: 'grader', onLoad: 'login-required'
// }


// // Initialisiert die Keycloak Instanz und öffnet das Login Fensters
// let keycloak = new Keycloak(initOptions);

// keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
//     if (!auth) {
//         window.location.reload();
//     } else {
//         console.log('Authenticated');
//         instantiateVueApp();
//     }


//     //Token Refresh
//     setInterval(() => {
//         keycloak.updateToken(70).then((refreshed) => {
//             if (refreshed) {
//                 console.log('Token refreshed: ' + refreshed);
//             } else {
//                 console.log('Token not refreshed, valid for '
//                     + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
//             }
//         }).catch(() => {
//             console.log('Failed to refresh token');
//         });
//     }, 6000)

// }).catch(() => {
//     console.log("Authenticated Failed");
// });






















