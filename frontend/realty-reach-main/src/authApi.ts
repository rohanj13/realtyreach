import axios from "axios";

const identityApi = axios.create({
  baseURL: "http://localhost:5209", // identity service URL
});


export default identityApi;