import http from "../http-common";
class DozentDataService {
    getAll() {
        return http.get("/dozenten");
    }
    get(id) {
        return http.get(`/dozenten/${id}`);
    }
    create(data) {
        return http.post("/dozenten", data);
    }
    update(id, data) {
        return http.put(`/dozenten/${id}`, data);
    }
    delete(id) {
        return http.delete(`/dozenten/${id}`);
    }
    deleteAll() {
        return http.delete(`/dozenten`);
    }
    findByEmail(email) {
        return http.get(`/dozenten?email=${email}`);
    }
}
export default new DozentDataService();
