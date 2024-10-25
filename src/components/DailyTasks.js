import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DailyTasks.css";
import { fetchWithAuth } from "../utils";
import { motionValue } from "framer-motion";

function DailyTasksComponent() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetchWithAuth("https://projectfour-groupfour-api.onrender.com/tasks", {
          method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const result = await response.json();
        setTasks(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);


  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await fetchWithAuth("https://projectfour-groupfour-api.onrender.com/create_task", {
          method: "POST",
          body: JSON.stringify({ text: newTask, completed: false }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to add task");

        const result = await response.json();
        setTasks((prevTasks) => [...prevTasks, result]);
        setNewTask("");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const updateTask = async (taskId, updatedFields) => {
    try {
      const response = await fetchWithAuth(
        `https://api.example.com/update-task/${taskId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedFields),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.task_id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError(err.message);
    }
  };


  const deleteTask = async (taskId) => {
    try {
      const response = await fetchWithAuth(
        `https://api.example.com/delete-task/${taskId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (id) => {
    setEditingIndex(id);
    const foundTask = tasks.find(task => task.task_id === id).text;
    setEditingText(foundTask);
  };

  return (
    <div className="daily-tasks-container">
      <h1>Daily Tasks</h1>
      <div className="task-input-container">
        <input
          type="text"
          id="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask} id="add-task">
          Add Task
        </button>
      </div>
      {error && <h3>{error}</h3>}
      <ul id="tasks-list">
        {tasks.map((task, index) => (
          <li
            key={movie.movie_id}
            className={`task-item ${task?.status === "Done" ? "Undone" : ""}`}
          >
            {editingIndex === task.task_id ? (
              <>
                <input
                  type="text"
                  className="edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={saveEdit} className="save-btn">
                  Save
                </button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task?.status === "Undone"}
                  onChange={() => updateTask(task?.task_id, {status: task?.status === "Undone" ? "Done" : "Undone"})}
                />
                <span className="task-text">{task.text}</span>
                <button
                  onClick={() => startEditing(task.task_id)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.task_id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  );
}

export default DailyTasksComponent;
