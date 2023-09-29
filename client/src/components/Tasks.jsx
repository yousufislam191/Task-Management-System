import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import Loading from "./Loading";
import apiHostName from "../../secret";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskCreateModal from "./TaskCreateModal";
import showToast from "./showToast";
import { ToastContainer } from "react-toastify";
import TaskTable from "./TaskTable";

const Tasks = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to store the selected task ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const notify = (status, message) => showToast(status, message);

  const getAllTasks = async () => {
    try {
      const res = await axios.get(`${apiHostName}/task`);
      if (res.data.success === true) {
        setLoading(true);
        setData(res.data.payload.tasks);
      }
    } catch (err) {
      setLoading(false);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
    }
  };

  const getAllTaskForSingleUser = async () => {
    try {
      const res = await axios.get(
        `${apiHostName}/task/user-all-task/${user.id}`
      );
      if (res.data.success === true) {
        setLoading(true);
        setData(res.data.payload.task);
      }
    } catch (err) {
      setLoading(false);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
    }
  };

  useEffect(() => {
    setLoading(false);
    user.isAdmin ? getAllTasks() : getAllTaskForSingleUser();
  }, []);

  const handleRowClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleTost = (data) => {
    notify(data.status, data.message);
  };

  return loading ? (
    user.isAdmin ? (
      success === false ? (
        <ErrorMessage status={status} message={errorMessage} />
      ) : (
        <>
          <ToastContainer />
          <TaskTable
            data={data}
            user={user}
            handleRowClick={handleRowClick}
            handleCreateTask={handleCreateTask}
            handleTost={handleTost}
            onUpdateTaskForDetails={getAllTasks}
          />

          {isModalOpen && selectedTaskId && (
            <TaskDetailsModal
              user={user}
              taskId={selectedTaskId}
              onClose={() => setIsModalOpen(false)}
              onUpdateTaskForDetails={getAllTasks}
            />
          )}
          {isCreateModalOpen && (
            <TaskCreateModal
              onClose={() => setIsCreateModalOpen(false)}
              onUpdateTask={getAllTasks}
            />
          )}
        </>
      )
    ) : (
      <>
        <ToastContainer />
        <TaskTable
          data={data}
          user={user}
          handleRowClick={handleRowClick}
          handleCreateTask={handleCreateTask}
          handleTost={handleTost}
        />

        {isModalOpen && selectedTaskId && (
          <TaskDetailsModal
            user={user}
            taskId={selectedTaskId}
            onClose={() => setIsModalOpen(false)}
            onUpdateTaskForDetails={getAllTasks}
          />
        )}
      </>
    )
  ) : (
    <Loading />
  );
};

export default Tasks;
