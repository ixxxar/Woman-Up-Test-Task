import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasks";

import usersReducer from "./users";

const rootReducer = combineReducers({
    users: usersReducer,
    tasks: tasksReducer
});

export function createStore() {
    return configureStore({
        reducer: rootReducer
    });
}
