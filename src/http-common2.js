import axios from "axios";
// http-common.js-Datei des Grappa-Webservices für den Zugriff auf den Grader aSQLg
export default axios.create({
	baseURL: "http://localhost:1119/grappa-webservice-2/rest/",
	headers: {
		'Content-Type': 'multipart/form-data'
	},
	auth: {
		username: "test",
		password: "test"
	}
});
