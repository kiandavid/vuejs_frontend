import http from "../http-common2";

class GraderService {

    // Schickt eine Lösung an den Grader
    create(data) {
        return http.post("/1/gradeprocesses?graderName=Asqlg&graderVersion=2.0&async=true", data);
    }

    // Holt das Feedback vom Grader, abhängig von der ID
    get(id) {
        return http.get(`/1/gradeprocesses/${id}`);
    }

}
export default new GraderService();
