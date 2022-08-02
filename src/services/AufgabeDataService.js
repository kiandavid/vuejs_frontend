import http from "../http-common";
class AufgabeDataService {
    getAll() {
        return http.get("/aufgaben");
    }
    get(id) {
        return http.get(`/aufgaben/${id}`);
    }
    create(data) {
        return http.post("/aufgaben", data);
    }
    update(id, data) {
        return http.put(`/aufgaben/${id}`, data);
    }
    delete(id) {
        return http.delete(`/aufgaben/${id}`);
    }
    deleteAll() {
        return http.delete(`/aufgaben`);
    }
    findByBezeichnung(bezeichnung) {
        return http.get(`/aufgaben?bezeichnung=${bezeichnung}`);
    }
}
export default new AufgabeDataService();
