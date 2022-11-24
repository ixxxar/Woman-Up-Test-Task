import React from "react";
import PropTypes from "prop-types";

const Register = ({
    isValid,
    onChange,
    onSubmit,
    errors,
    data,
    buttonText
}) => {
    return (
        <form onSubmit={onSubmit} className="form">
            <label htmlFor="email" className="labelText">
                Введите вашу Эл. Почту
            </label>
            <input
                id="email"
                name="email"
                type="text"
                className="formInput"
                onChange={onChange}
                value={data.email}
            />
            <p className={"errorHandler" + (!isValid ? " showError" : "")}>
                {errors.email}
            </p>
            <label htmlFor="password" className="labelText">
                Введите пароль
            </label>
            <input
                id="password"
                name="password"
                type="password"
                className="formInput"
                onChange={onChange}
                value={data.password}
            />
            <p className={"errorHandler" + (!isValid ? " showError" : "")}>
                {errors.password}
            </p>
            {isValid ? (
                <button type="submit" className="subButton">
                    {buttonText}
                </button>
            ) : (
                <button disabled type="submit" className="subButton disButton">
                    {buttonText}
                </button>
            )}
        </form>
    );
};

Register.propTypes = {
    isValid: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    errors: PropTypes.object,
    data: PropTypes.object,
    buttonText: PropTypes.string
};

export default Register;
