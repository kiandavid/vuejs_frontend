import axios from "axios";
// http-common.js-Datei des Node.js-Servers für den Datenbankzugriff
export default axios.create({
    baseURL: "http://localhost:8082/api",
    headers: {
        "Content-type": "application/json"
    }
});
