import axios from "axios";
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
