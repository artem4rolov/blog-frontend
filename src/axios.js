import axios from "axios";

// настраиваем бесконечные запросы к бэкенду
const instance = axios.create({
  baseURL: "http://localhost:4444",
});

// middleware (посредник)
// когда происходит ЛЮБОЙ запрос, всегда проверяем localStorage на наличие токена авторизации
instance.interceptors.request.use((config) => {
  // вшиваем в каждый запрос (в headers любого запроса постов, комментариев, создания поста и тд) переменную из calStorage
  config.headers.Authorization = window.localStorage.getItem("token");
  // возвращаем измененную конфигурацию axios
  return config;
});

export default instance;
