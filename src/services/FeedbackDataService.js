import http from "../http-common";
class FeedbackDataService {
    getAll() {
        return http.get("/feedback");
    }
    get(id) {
        return http.get(`/feedback/${id}`);
    }
    create(data) {
        return http.post("/feedback", data);
    }
    update(id, data) {
        return http.put(`/feedback/${id}`, data);
    }
    delete(id) {
        return http.delete(`/feedback/${id}`);
    }
    deleteAll() {
        return http.delete(`/feedback`);
    }
}
export default new FeedbackDataService();
