import React from "react";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../store/users";
import { Navigate } from "react-router-dom";
import TasksLoader from "./tasksLoader";

/**
 * Компонент для проверки на авторизацию пользователя
 *
 * @component
 */

const AuthRequired = () => {
    const isLoggedIn = useSelector(getIsLoggedIn());

    return (
        <>
            {isLoggedIn ? (
                <TasksLoader />
            ) : (
                <Navigate to="/auth/login" replace />
            )}
        </>
    );
};

export default AuthRequired;
