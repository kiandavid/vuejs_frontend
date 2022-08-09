import http from "../http-common";
class BewertungsaspektDataService {
    getAll() {
        return http.get("/bewertungsaspekte");
    }
    get(id) {
        return http.get(`/bewertungsaspekte/${id}`);
    }
    create(data) {
        return http.post("/bewertungsaspekte", data);
    }
    update(id, data) {
        return http.put(`/bewertungsaspekte/${id}`, data);
    }
    delete(id) {
        return http.delete(`/bewertungsaspekte/${id}`);
    }
    deleteAll() {
        return http.delete(`/bewertungsaspekte`);
    }
}
export default new BewertungsaspektDataService();
