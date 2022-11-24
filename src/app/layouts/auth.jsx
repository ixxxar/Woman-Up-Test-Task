import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Register from "../components/common/register";
import { logIn, signUp } from "../store/users";
import { validator } from "../utils/validator";

/**
 * Компонент для авторизации
 * Использует валидацию по принципу:
 * Проверка на валидность Email и Password
 *
 * @component
 */

const Auth = () => {
    const { type } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formType, setFormType] = useState(
        type === "register" ? type : "login"
    );
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        password: {
            isRequired: {
                message: "Пароль обязателен для заполнения"
            },
            isCapitalSymbol: {
                message: "Пароль должен содержать хотя бы одну заглавную букву"
            },
            isContainDigit: {
                message: "Пароль должен содержать хотя бы одно число"
            },
            min: {
                message: "Пароль должен состоять минимум из 8 символов",
                value: 8
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const handleChange = ({ target }) => {
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        if (formType === "register") {
            await dispatch(signUp(data));
            navigate("/");
        } else {
            await dispatch(logIn(data));
            navigate("/");
        }
    };
    return (
        <>
            {formType === "register" ? (
                <div className="flexContainer">
                    <div className="registerCard">
                        <h3 className="headerText">Регистрация</h3>
                        <Register
                            errors={errors}
                            isValid={isValid}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            data={data}
                            buttonText="Зарегистрироваться"
                        />
                        <p className="textToRedirect">
                            Уже зарегистрированы?{" "}
                            <a
                                onClick={() => setFormType("login")}
                                className="redirectLink"
                            >
                                Войти
                            </a>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flexContainer">
                    <div className="registerCard">
                        <h3 className="headerText">Вход</h3>
                        <Register
                            errors={errors}
                            isValid={isValid}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            data={data}
                            buttonText="Войти"
                        />
                        <p className="textToRedirect">
                            Еще не зарегистрированы?{" "}
                            <a
                                onClick={() => setFormType("register")}
                                className="redirectLink"
                            >
                                Регистрация
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Auth;
