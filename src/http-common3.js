import axios from "axios";
// http-common.js-Datei des Node.js-Servers für den Dateizugriff über das lokale Dateisystem
export default axios.create({
    baseURL: "http://localhost:8082/api"
});
