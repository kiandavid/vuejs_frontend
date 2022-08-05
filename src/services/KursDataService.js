import http from "../http-common";
class KursDataService {
    getAll() {
        return http.get("/kurse");
    }
    get(id) {
        return http.get(`/kurse/${id}`);
    }
    create(data) {
        return http.post("/kurse", data);
    }
    create(data) {
        return http.post(`/kurse/${id}`, data);
    }
    update(id, data) {
        return http.put(`/kurse/${id}`, data);
    }
    delete(id) {
        return http.delete(`/kurse/${id}`);
    }
    deleteAll() {
        return http.delete(`/kurse`);
    }
    findByBezeichnung(bezeichnung) {
        return http.get(`/kurse?bezeichnung=${bezeichnung}`);
    }
}
export default new KursDataService();
