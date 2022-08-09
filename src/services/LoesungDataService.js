import http from "../http-common";
class LoesungDataService {
    getAll() {
        return http.get("/loesungen");
    }
    get(id) {
        return http.get(`/loesungen/${id}`);
    }
    create(data) {
        return http.post("/loesungen", data);
    }
    update(id, data) {
        return http.put(`/loesungen/${id}`, data);
    }
    delete(id) {
        return http.delete(`/loesungen/${id}`);
    }
    deleteAll() {
        return http.delete(`/loesungen`);
    }
}
export default new LoesungDataService();
