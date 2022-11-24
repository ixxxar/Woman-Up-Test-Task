import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../store/users";

/**
 * Компонент для выхода пользователя из системы
 *
 * @component
 */

const LogOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(logOut());
        navigate("/");
    }, []);

    return <h1>Loading</h1>;
};

export default LogOut;
