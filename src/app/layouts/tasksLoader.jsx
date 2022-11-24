import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Index from "../components/pages";
import { getIsLoggedIn, getUsersLoadingStatus, loadUser } from "../store/users";

/**
 * Компонент для загрузки существующих задач
 *
 * @component
 */

const TasksLoader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isUserLoggedIn = useSelector(getIsLoggedIn());
    // const currentUserId = useSelector(getCurrentUserId());
    const dataStatus = useSelector(getUsersLoadingStatus());
    console.log(isUserLoggedIn);
    useEffect(() => {
        if (isUserLoggedIn) {
            dispatch(loadUser());
        } else {
            navigate("/auth/login");
        }
    }, []);
    if (dataStatus) return "Loading";
    return (
        <>
            <Index />
        </>
    );
};

export default TasksLoader;
