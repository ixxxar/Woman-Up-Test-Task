import httpService from "./http.service";
import localStorageService from "./localStorage.service";

const userEndpoint = "user/";

/**
 * Сервис для работы с пользователями
 */
const userService = {
    /**
     * Получение всех пользователей
     */
    get: async () => {
        const { data } = await httpService.get(userEndpoint);
        return data;
    },
    /**
     * Создание пользователя
     * @param {Object} payload Данные пользователя
     */
    create: async (payload) => {
        const { data } = await httpService.put(
            userEndpoint + payload._id,
            payload
        );
        return data;
    },
    /**
     * Получение данных об авторизованном пользователе
     */
    getCurrentUser: async () => {
        const { data } = await httpService.get(
            userEndpoint + localStorageService.getUserId()
        );
        return data;
    },
    /**
     * Обновление данных пользователя
     * @param {Object} payload Данные пользователя
     */
    update: async (payload) => {
        const { data } = await httpService.patch(
            userEndpoint + localStorageService.getUserId(),
            payload
        );
        return data;
    }
};
export default userService;
