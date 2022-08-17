import http from "../http-common3";
class AufgabeDataService2 {
    get(path) {
        return http.get(`/aufgabe?path=${path}`);
    }
}
export default new AufgabeDataService2();
