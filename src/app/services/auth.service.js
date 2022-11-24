import axios from "axios";
import localStorageService from "./localStorage.service";

/**
 * Создание Instance для сервиса авторизации
 */

export const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/v1/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
});

/**
 * Сервис обращению к Firebase для работы с авторизацией
 */

const authService = {
    /**
     * Отправка запроса на регистрацию пользователя
     * @param {String} email Эл. Почта пользователя
     * @param {String} password Пароль пользователя
     */
    register: async ({ email, password }) => {
        const { data } = await httpAuth.post(`accounts:signUp`, {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    /**
     * Отправка запроса на авторизацию пользователя
     * @param {String} email Эл. Почта пользователя
     * @param {String} password Пароль пользователя
     */
    login: async ({ email, password }) => {
        const { data } = await httpAuth.post(`accounts:signInWithPassword`, {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    /**
     * Отправка запроса на обновление токенов
     * @param {String} email Эл. Почта пользователя
     * @param {String} password Пароль пользователя
     */
    refresh: async () => {
        const { data } = await httpAuth.post("token", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });
        return data;
    }
};

export default authService;
