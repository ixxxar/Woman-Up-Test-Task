import { createAction, createSlice } from "@reduxjs/toolkit";
import taskService from "../services/task.service";

/**
 * Начиальное значение для задач
 */
const initialState = {
    entities: [],
    isLoading: true,
    error: null
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        tasksRequested: (state) => {
            state.isLoading = true;
        },
        tasksRecieved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        taskRequestFailed: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        taskCreated: (state, action) => {
            state.entities === null
                ? (state.entities = [action.payload])
                : state.entities.push(action.payload);
        },
        taskUpdated: (state, action) => {
            const indexOfElement = state.entities.findIndex(
                (e) => e._id === action.payload._id
            );
            state.entities[indexOfElement] = action.payload;
        },
        taskDeleted: (state, action) => {
            state.entities = state.entities.filter(
                (i) => i._id !== action.payload
            );
        },
        taskFinished: (state, action) => {
            const indexOfElement = state.entities.findIndex(
                (e) => e._id === action.payload.taskId
            );
            state.entities[indexOfElement].active = false;
            state.entities[indexOfElement].date_finished =
                action.payload.dateFinished;
        }
    }
});

const { actions, reducer: tasksReducer } = tasksSlice;
const {
    tasksRequested,
    tasksRecieved,
    taskRequestFailed,
    taskCreated,
    taskUpdated,
    taskDeleted,
    taskFinished
} = actions;

const createTaskRequested = createAction("tasks/createTaskRequested");
const updateTaskRequested = createAction("tasks/createTaskRequested");
const deleteTaskRequested = createAction("tasks/createTaskRequested");
/**
 * Загрузка списка задач
 * @param {String} userId ID пользователя
 */
export const loadTasks = (userId) => async (dispatch) => {
    dispatch(tasksRequested());
    try {
        const { content } = await taskService.get(userId);
        dispatch(tasksRecieved(content));
    } catch (error) {
        dispatch(taskRequestFailed(error.message));
    }
};

/**
 * Создание новой задачи
 * @param {String} userId ID пользователя
 * @param {Object} payload Данные задачи
 */
export const createNewTask = (userId, payload) => async (dispatch) => {
    dispatch(createTaskRequested());
    try {
        const { content } = await taskService.createNew(userId, payload);
        dispatch(taskCreated(content));
    } catch (error) {
        dispatch(taskRequestFailed(error.message));
    }
};

/**
 * Обновление данных задачи
 * @param {String} userId ID пользователя
 * @param {String} taskId ID задачи
 * @param {Object} payload Данные задачи
 */
export const updateTask = (userId, taskId, payload) => async (dispatch) => {
    dispatch(updateTaskRequested());
    try {
        const { content } = await taskService.update(userId, taskId, payload);
        dispatch(taskUpdated(content));
    } catch (error) {
        dispatch(taskRequestFailed(error.message));
    }
};

/**
 * Удаление задачи
 * @param {String} userId ID пользователя
 * @param {String} taskId ID задачи
 */
export const deleteTask = (userId, taskId) => async (dispatch) => {
    dispatch(deleteTaskRequested());
    try {
        const { content } = await taskService.deleteTask(userId, taskId);
        if (content === null) {
            dispatch(taskDeleted(taskId));
        }
    } catch (error) {
        dispatch(taskRequestFailed(error.message));
    }
};

/**
 * Завершение задачи
 * @param {String} userId ID пользователя
 * @param {String} taskId ID задачи
 */
export const finishTask = (userId, taskId) => async (dispatch) => {
    dispatch(updateTaskRequested());
    try {
        const dateFinished = Date.now();
        await taskService.finishTask(userId, taskId, dateFinished);
        dispatch(taskFinished({ taskId, dateFinished }));
    } catch (error) {
        dispatch(taskRequestFailed(error.message));
    }
};

/**
 * Узнать статус загрузки задач
 */
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

/**
 * Получить массив всех задач
 */
export const getTasksList = () => (state) => state.tasks.entities;

/**
 * Получить объект задачи по ID
 * @param {String} taskId ID задачи
 */
export const getTaskById = (taskId) => (state) =>
    state.tasks.entities.find((t) => t._id === taskId);

export default tasksReducer;
