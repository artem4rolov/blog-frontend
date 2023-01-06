import axios from "axios";

// настраиваем бесконечные запросы к бэкенду
const instance = axios.create({
  baseURL: "http://localhost:4444",
});

export default instance;
