import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";

/**
 * Начиальное значение для задач
 */
const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersRecieved: (state, action) => {
            state.entities = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            console.log(action.payload);
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.isLoggedIn = false;
            state.auth = null;
            state.dataLoaded = false;
        },
        userUpdateSuccessed: (state, action) => {
            const userIndex = state.entities.findIndex(
                (u) => u._id === action.payload._id
            );
            state[userIndex] = action.payload;
        },
        authRequested: (state) => {
            state.error = null;
        }
    }
});

const { actions, reducer: usersReducer } = usersSlice;
const {
    usersRequested,
    usersRecieved,
    usersRequestFailed,
    authRequestSuccess,
    authRequestFailed,
    userCreated,
    userLoggedOut
} = actions;

const authRequested = createAction("users/authRequested");
const userCreateRequested = createAction("users/userCreateRequested");
const createUserFailed = createAction("users/createUserFailed");
/**
 * Выход пользователя из системы
 */
export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
};

/**
 * Вход пользователя в систему
 * @param {Object} payload Данные пользователя
 */
export const logIn = (payload) => async (dispatch) => {
    dispatch(authRequested());
    const { email, password } = payload;
    try {
        const data = await authService.login({ email, password });
        dispatch(authRequestSuccess({ userId: data.localId }));
        localStorageService.setTokens(data);
    } catch (error) {
        dispatch(authRequestFailed(error.message));
    }
};

/**
 * Регистрация нового пользователя
 */
export const signUp =
    ({ email, password }) =>
    async (dispatch) => {
        dispatch(authRequested());
        try {
            const data = await authService.register({ email, password });
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess({ userId: data.localId }));
            dispatch(
                createUser({
                    _id: data.localId,
                    email,
                    tasks: []
                })
            );
        } catch (error) {
            dispatch(authRequestFailed(error.message));
        }
    };

/**
 * Создание нового пользователя
 * @param {Object} payload Данные пользователя
 */
function createUser(payload) {
    return async function (dispatch) {
        dispatch(userCreateRequested());
        try {
            const { content } = await userService.create(payload);
            dispatch(userCreated(content));
        } catch (error) {
            dispatch(createUserFailed());
        }
    };
}

/**
 * Загрузка данных о текущем пользователе
 */
export const loadUser = () => async (dispatch) => {
    dispatch(usersRequested());
    try {
        const { content } = await userService.getCurrentUser();
        dispatch(usersRecieved(content));
    } catch (error) {
        dispatch(usersRequestFailed(error.message));
    }
};

/**
 * Получение статуса входа в систему пользователя
 */
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;

/**
 * Получение ID текущего пользователя
 */
export const getCurrentUserId = () => (state) => state.users.auth.userId;

/**
 * Получение статуса загрузки данных пользователя
 */
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;

/**
 * Получение данных текущего пользователя
 */
export const getCurrentUserData = () => (state) => {
    return state.users.entities;
};

export default usersReducer;
