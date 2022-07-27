import http from "../http-common";
class StudentDataService {
    getAll() {
        return http.get("/studenten");
    }
    get(id) {
        return http.get(`/studenten/${id}`);
    }
    create(data) {
        return http.post("/studenten", data);
    }
    update(id, data) {
        return http.put(`/studenten/${id}`, data);
    }
    delete(id) {
        return http.delete(`/studenten/${id}`);
    }
    deleteAll() {
        return http.delete(`/studenten`);
    }
    findByEmail(email) {
        return http.get(`/studenten?email=${email}`);
    }
}
export default new StudentDataService();
