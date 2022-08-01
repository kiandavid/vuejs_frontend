import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Keycloak from 'keycloak-js'

// Methode zum Starten der Vue App
function instantiateVueApp() {
    createApp(App).use(store).use(store)
        .use(router)
        .mount('#app')
}

// instantiateVueApp();


// Gibt den Access Token als JSON zurück
export function getUserToken() {
    // console.log("tokenParsed: " + JSON.stringify(keycloak.tokenParsed, null, 4));
    let token = keycloak.tokenParsed;
    return token;
}

export function switchUserRole() {
    keycloak.realmAccess.roles[0] = "Dozent";
    console.log("User Role: " + keycloak.realmAccess.roles[0]);
}


// Meldet den Benutzer ab
export function logout() {
    keycloak.logout(logoutOptions).then((success) => {
        console.log("Logout success: " + success);
    }).catch((error) => {
        console.log("Logout error: ", error);
    });
}

// Redirect Link für Logout
var logoutOptions = { redirectUri: 'http://localhost:8081/' };


// Konfig Daten für Keycloak
let initOptions = {
    url: 'http://localhost:8080/', realm: 'Grader', clientId: 'grader', onLoad: 'login-required'
}


// Initialisiert die Keycloak Instanz und öffnet das Login Fensters
let keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
    if (!auth) {
        window.location.reload();
    } else {
        instantiateVueApp();
        store.dispatch('setUser', getUserToken());
        console.log('Authenticated');
    }

    //Token Refresh
    setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
            if (refreshed) {
                console.log('Token refreshed: ' + refreshed);
            } else {
                console.log('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).catch(() => {
            console.log('Failed to refresh token');
        });
    }, 60000)

}).catch(() => {
    console.log("Authenticated Failed");
});























