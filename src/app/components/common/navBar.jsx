import React, { useEffect } from "react";
import "datejs";
import { useSelector } from "react-redux";
import { getCurrentUserData } from "../../store/users";

/**
 * Компонент для отображения NavBar'a
 * Использует SetInterval для показа текущей даты и времени
 *
 * @component
 */

const NavBar = () => {
    const data = useSelector(getCurrentUserData());
    useEffect(() => {
        setInterval(() => {
            const timeStampElement = document.getElementById("timeStamp");
            timeStampElement.innerText = Date.parse(
                new Date()
            ).toLocaleString();
        }, 1000);
    }, []);
    return (
        <div className="navBar">
            <div>
                <p>
                    Текущая дата: <span id="timeStamp"></span>
                </p>
            </div>
            <div>
                <p>
                    Email: {data.email} <a href="/logout">Выйти</a>
                </p>
            </div>
        </div>
    );
};

export default NavBar;
