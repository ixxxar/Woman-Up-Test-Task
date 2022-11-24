import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import editIcon from "../../../media/edit.svg";
import { getCurrentUserId } from "../../store/users";
import { storage } from "../../utils/firebaseConfig";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { deleteTask, finishTask, updateTask } from "../../store/tasks";

/**
 * Компонент для отображения карточек задач
 *
 * @component
 */
const TaskCard = ({ card }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState({
        title: card.title,
        description: card.description,
        date_end: card.date_end
    });
    const [state, setState] = useState(card.is_new ? "change" : "view");
    const currentUserId = useSelector(getCurrentUserId());
    /**
     * Изменение статуса редактирования задачи
     */
    const handleStateChange = () => {
        state === "view" ? setState("change") : setState("view");
    };
    /**
     * Получение URL на скачивание картинки с сервера Firebase
     * @param {String} fileUrl URL до файла на сервере
     */
    const getUrlToFile = (fileUrl) => {
        getDownloadURL(ref(storage, fileUrl))
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.open("GET", url);
                xhr.onload = () => {
                    const blob = xhr.response;
                    console.log(blob);
                    const newUrl = URL.createObjectURL(blob);
                    console.log(newUrl);
                    const element = document.getElementById(fileUrl + "link");
                    element.href = newUrl;
                };
                xhr.send();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    /**
     * Запись данных из формы
     */
    const handleInputChange = ({ target }) => {
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];
        const dateEnd = e.target.date_end.value;
        if (file) {
            await uploadBytes(
                ref(storage, `${currentUserId}/${card._id}/${file.name}`),
                file
            ).catch((error) => {
                toast.error(error.message);
            });
        }
        const dataToUpload = {
            ...data,
            _id: card._id,
            active: true,
            is_new: false,
            date_end: dateEnd,
            files: file
                ? [`${currentUserId}/${card._id}/${file.name}`]
                : card.files
                ? card.files
                : null
        };

        dispatch(updateTask(currentUserId, card._id, dataToUpload));
        setState("view");

        console.log(card.files);
    };

    const handleDeleteTask = () => {
        dispatch(deleteTask(currentUserId, card._id));
    };

    const handleFinishTask = () => {
        dispatch(finishTask(currentUserId, card._id));
    };

    useEffect(() => {
        if (card.date_end) {
            if (card.date_end.length > 0) {
                const result = Date.compare(
                    new Date(),
                    Date.parse(card.date_end)
                );
                if (result === 1) {
                    dispatch(finishTask(currentUserId, card._id));
                }
            }
        }
    }, []);

    return (
        <>
            {state === "view" ? (
                <div
                    className={
                        card.active === true ? "card" : "card finishedTask"
                    }
                >
                    {card.active && (
                        <button
                            className="editButton"
                            onClick={handleStateChange}
                        >
                            <img src={editIcon} />
                        </button>
                    )}
                    <h4 className="card-title">{card.title}</h4>
                    {card.description.length > 0 && (
                        <p className="card-description">{card.description}</p>
                    )}
                    {card.files &&
                        card.files.map((f) => {
                            getUrlToFile(f);
                            return (
                                <p key={f} className="card-description">
                                    <a
                                        id={f + "link"}
                                        href=""
                                        download
                                        target="_blank"
                                    >
                                        {f.split("/").at(-1)}
                                    </a>
                                </p>
                            );
                        })}
                    {card.active === true ? (
                        <p className="card-description">
                            Завершится:{" "}
                            {card.date_end.length === 0
                                ? "Бессрочно"
                                : Date?.parse(card.date_end)?.toLocaleString()}
                        </p>
                    ) : (
                        <p className="card-description">
                            Завершена:
                            {Date?.parse(
                                new Date(card.date_finished)
                            )?.toLocaleString()}
                        </p>
                    )}
                    <div className="actions">
                        {card.active && (
                            <button onClick={handleFinishTask}>
                                Завершить
                            </button>
                        )}
                        <button onClick={handleDeleteTask}>Удалить</button>
                    </div>
                </div>
            ) : (
                <div className="card flexItems editableForm">
                    <form onSubmit={handleSubmit}>
                        <button
                            className="editButton"
                            onClick={handleStateChange}
                        >
                            <img src={editIcon} />
                        </button>
                        <h4 className="card-description">
                            <input
                                name="title"
                                required
                                value={data.title}
                                type="text"
                                placeholder="Заголовок"
                                onChange={handleInputChange}
                            />
                        </h4>

                        <p className="card-description">
                            <input
                                name="description"
                                value={data.description}
                                type="text"
                                placeholder="Описание"
                                onChange={handleInputChange}
                            />
                        </p>
                        <p className="card-description">
                            <input name="file" type="file" />
                        </p>
                        <p className="card-description">
                            <input
                                name="date_end"
                                type="datetime-local"
                                value={data.date_end}
                                onChange={handleInputChange}
                            />
                        </p>

                        <div className="actions">
                            <button>Сохранить</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

TaskCard.propTypes = {
    card: PropTypes.object
};

export default TaskCard;
