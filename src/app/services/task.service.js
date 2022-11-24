import httpService from "./http.service";

const tasksEndpoint = "task/";

/**
 * Сервис для работы с задачами
 */
const taskService = {
    /**
     * Получение всех задач
     * @param {String} userId ID пользователя
     */
    get: async (userId) => {
        const { data } = await httpService.get(tasksEndpoint + userId);
        return data;
    },
    /**
     * Создание новой задачи
     * @param {String} userId ID пользователя
     * @param {Object} payload Данные задачи
     */
    createNew: async (userId, payload) => {
        const { data } = await httpService.put(
            tasksEndpoint + userId + "/" + payload._id,
            { ...payload, is_new: true }
        );
        return data;
    },
    /**
     * Обновление данных о задаче
     * @param {String} userId ID пользователя
     * @param {String} taskId ID задачи
     * @param {Object} payload Данные задачи
     */
    update: async (userId, taskId, payload) => {
        const { data } = await httpService.patch(
            tasksEndpoint + userId + "/" + taskId,
            payload
        );
        return data;
    },
    /**
     * Удаление задачи
     * @param {String} userId ID пользователя
     * @param {String} taskId ID задачи
     */
    deleteTask: async (userId, taskId) => {
        const { data } = await httpService.delete(
            tasksEndpoint + userId + "/" + taskId
        );
        return data;
    },
    /**
     * Завершение срока действия задачи
     * @param {String} userId ID пользователя
     * @param {String} taskId ID задачи
     * @param {Date} dateFinished Дата завершения задачи
     */
    finishTask: async (userId, taskId, dateFinished) => {
        const { data } = await httpService.patch(
            tasksEndpoint + userId + "/" + taskId,
            { active: false, date_finished: dateFinished }
        );
        return data;
    }
};

export default taskService;
