import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Keycloak from 'keycloak-js'

// Methode zum Starten der Vue App
function instantiateVueApp() {
    createApp(App)
        .use(router)
        .mount('#app')
}

instantiateVueApp();

// Gibt den Access Token als JSON zurück
export function getUserToken() {
    console.log("tokenParsed: " + JSON.stringify(keycloak.tokenParsed, null, 4));
    let token = keycloak.tokenParsed;
    return token;
}

// Gibt die Benuterrolle als JSON zurück
export function getUserRole() {
    console.log("User role: " + JSON.stringify(keycloak.tokenParsed.realm_access.roles[0], null, 4));
    let role = keycloak.tokenParsed.realm_access.roles[0];
    return role;
}

// Meldet den Benutzer ab
export function logout() {
    console.log("Logout tried");
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
        console.log('Authenticated');
        // Ab hier kann ich einen Boolean im State setzen, um zu wissen, wann ich auf den Token zugreifen kann
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
    }, 6000)

}).catch(() => {
    console.log("Authenticated Failed");
});






















