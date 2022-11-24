import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewTask, getTasksList, loadTasks } from "../../store/tasks";
import { getCurrentUserId, getIsLoggedIn } from "../../store/users";
import NavBar from "../common/navBar";
import TaskCard from "../common/taskCard";
import "datejs";

/**
 * Компонент для отображения списка задач
 * Задачи отображаюстя по следующему принципу: сначала активные, затем завершённые
 *
 * @component
 */

const Index = () => {
    const dispatch = useDispatch();
    const isUserLoggedIn = useSelector(getIsLoggedIn());
    const currentUserId = useSelector(getCurrentUserId());
    const tasksList = useSelector(getTasksList());
    const navigate = useNavigate();
    if (!isUserLoggedIn) {
        navigate("/auth/login");
    }
    useEffect(() => {
        if (isUserLoggedIn) {
            dispatch(loadTasks(currentUserId));
        }
    }, []);

    const handleCreate = async () => {
        const newTaskId = Date.now();
        const newTaskData = {
            _id: newTaskId.toString(),
            title: "",
            description: "",
            files: "",
            date_end: "",
            active: true
        };
        await dispatch(createNewTask(currentUserId, newTaskData));
    };

    return (
        <>
            <NavBar />
            <div className="createNewTaskContainer">
                <button onClick={handleCreate} className="createNewButton">
                    Создать задачу
                </button>
            </div>
            <div className="gridContainer">
                {tasksList
                    ? tasksList.map((i) =>
                          i.active === true ? (
                              <TaskCard
                                  key={i._id}
                                  card={{
                                      _id: i._id,
                                      title: i.title,
                                      description: i.description,
                                      date_end: i.date_end,
                                      files: i.files,
                                      active: i.active,
                                      is_new: i.is_new
                                  }}
                              />
                          ) : null
                      )
                    : null}
                {tasksList
                    ? tasksList.map((i) =>
                          i.active === false ? (
                              <TaskCard
                                  key={i._id}
                                  card={{
                                      _id: i._id,
                                      title: i.title,
                                      description: i.description,
                                      date_end: i.date_end,
                                      files: i.files,
                                      active: i.active,
                                      date_finished: i.date_finished
                                  }}
                              />
                          ) : null
                      )
                    : null}
            </div>
        </>
    );
};

export default Index;
