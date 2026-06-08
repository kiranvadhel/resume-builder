import axios from "axios";

const api = axios.create({
    baseURL: "https://resume-builder-grwh.onrender.com/api"
});

export default api;