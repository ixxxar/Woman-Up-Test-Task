import axios from "axios";
import { toast } from "react-toastify";
import authService from "./auth.service";
import localStorageService from "./localStorage.service";

/**
 * Создание Instance для сервиса запросов к Firebase
 */

const http = axios.create({
    baseURL:
        "https://womanup-test-task-ac0ad-default-rtdb.europe-west1.firebasedatabase.app/"
});

http.interceptors.request.use(
    async function (config) {
        const containSlash = /\/$/gi.test(config.url);
        config.url =
            (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
        const expiresDate = localStorageService.getTokenExpiresDate();
        const refreshToken = localStorageService.getRefreshToken();
        if (refreshToken && expiresDate < Date.now()) {
            const data = await authService.refresh();

            localStorageService.setTokens({
                refreshToken: data.refresh_token,
                idToken: data.id_token,
                expiresIn: data.expires_id,
                localId: data.user_id
            });
        }
        const accessToken = localStorageService.getAccessToken();
        if (accessToken) {
            config.params = { ...config.params, auth: accessToken };
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/**
 * Преобразование данных до необходимого вида
 */
function transformData(data) {
    return data && !data._id
        ? Object.keys(data).map((key) => ({
              ...data[key]
          }))
        : data;
}
http.interceptors.response.use(
    (res) => {
        res.data = { content: transformData(res.data) };
        return res;
    },
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors) {
            console.log(error);
            toast.error("Something was wrong. Try it later");
        }
        return Promise.reject(error);
    }
);

/**
 * Сервис для общения с БД Firebase
 */
const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};
export default httpService;
