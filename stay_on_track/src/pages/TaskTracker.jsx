import React, { useState, useEffect } from "react";

export default function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",  // nou
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    
    fetch("http://localhost:5000/task-list/tasks.json",{
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setTasks(data.task_list);
    }).catch((error) => {
      console.error("Eroare la incarcarea task-urilor de pe server:", error)
      // Incarca task-urile din localStorage ca fallback
      setTasks(JSON.parse(localStorage.getItem("tasks") || "[]"));
    });

  };

  const saveTasks = (tasks) => {
    setTasks(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    fetch("http://localhost:5000/task-list/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        task_list: tasks,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Task list updated successfully:", data.message);
    })
    .catch((error) => {
      console.error("Eroare la actualizarea task-urilor pe server:", error);
    });

  };

  const addTask = () => {
    if (!formData.title) {
      alert("Te rog introdu un titlu pentru task!");
      return;
    }
    if (!formData.date) {
      alert("Te rog selecteaza o data!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title,
      description: formData.description || "",
      dueDate: formData.date,
      completed: false
    };

    saveTasks([...tasks, newTask]);
    resetForm();
  };

  const deleteTask = (id) => {
    if (window.confirm("Esti sigur ca vrei sa stergi acest task?")) {
      saveTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const editTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        date: task.date,
        time: task.time || "",
      });
      setEditId(id);
      setShowForm(true);
    }
  };

  const updateTask = () => {
    const updated = tasks.map((t) =>
      t.id === editId ? { ...t, ...formData } : t
    );
    saveTasks(updated);
    resetForm();
  };



  const toggleTaskForm = () => {
    setShowForm((prev) => !prev);
    if (!showForm) {
      setFormData({
        ...formData,
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const toggleComplete = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);
  };

  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
    });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerH1}>Task Manager</h1>
      </div>

      <div style={styles.content}>
        <button style={styles.addTaskBtn} onClick={toggleTaskForm}>
          + Adauga Task Nou
        </button>

        {showForm && (
          <div style={{ ...styles.taskForm, display: "block" }}>
            <div style={styles.formGroup}>
              <label htmlFor="taskTitle" style={styles.formGroupLabel}>
                Titlu Task:
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Introdu titlul task-ului..."
                style={styles.formGroupInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="taskDescription" style={styles.formGroupLabel}>
                Descriere (Optional):
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrie task-ul..."
                style={{ ...styles.formGroupInput, ...styles.formGroupTextarea }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formGroupLabel}>Data si Ora:</label>
              <div style={styles.datetimeGroup}>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={styles.formGroupInput}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={styles.formGroupInput}
                />
              </div>
            </div>
            

            <div style={styles.formGroup}>
              <label style={styles.formGroupLabel}>Durata (Optional):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="5"
                step="5"
                style={styles.formGroupInput}
              />

            </div>

            <div style={styles.formGroup}>
              <button
                style={styles.submitBtn}
                onClick={editId ? updateTask : addTask}
              >
                {editId ? "Actualizeaza Task" : "Adauga Task"}
              </button>
              <button style={styles.cancelBtn} onClick={resetForm}>
                Anuleaza
              </button>
            </div>
          </div>
        )}

        <div style={styles.tasksList}>
          {tasks.map((task) => {
            const dateTime = new Date(
              `${task.date} ${task.time || "00:00"}`
            ).toLocaleString("ro-RO", {
              year: "numeric",
              month: "long",
              day: "numeric",
              // hour: "2-digit",
              // minute: "2-digit",
            });

            return (
              <div key={task.id} style={styles.taskItem}>
                <div
                  style={styles.taskContent}
                  onClick={() => editTask(task.id)}
                >
                  <div
                    style={
                      task.completed
                        ? { ...styles.taskTitle, ...styles.taskTitleCompleted }
                        : styles.taskTitle
                    }
                  >

                  {task.duration && task.duration > 0 && (
                    <span style={{ marginRight: 8, color: "#666" }}>
                      {task.duration} min
                    </span>
                  )}

                    {task.title}

                  </div>
                  {task.description && (
                    <div style={styles.taskDescription}>
                      {task.description}
                    </div>
                  )}
                  <div style={styles.taskDatetime}>📅 {dateTime}</div>
                </div>

                <div style={styles.taskActions}>
                  <span
                    onClick={() => toggleComplete(task.id)}
                    title={
                      task.completed
                        ? "Marcheaza ca necompletat"
                        : "Marcheaza ca completat"
                    }
                    style={{ ...styles.completeBtn, userSelect: "none" }}
                  >
                    {task.completed ? "✅" : "☐"}
                  </span>
                  <span
                    onClick={() => deleteTask(task.id)}
                    title="Sterge task"
                    style={{ ...styles.deleteBtn, userSelect: "none" }}
                  >
                    🗑️
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    marginTop: "20px",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "30px",
    textAlign: "center",
  },
  headerH1: {
    margin: 0,
    fontSize: "2.5em",
    fontWeight: 300,
  },
  content: {
    padding: "30px",
  },
  addTaskBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    fontSize: "16px",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    marginBottom: "20px",
  },
  taskForm: {
    background: "#f8f9fa",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "30px",
    border: "2px solid #e9ecef",
    display: "none",
    animation: "slideDown 0.3s ease",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formGroupLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    color: "#495057",
  },
  formGroupInput: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  formGroupTextarea: {
    resize: "vertical",
    minHeight: "100px",
  },
  datetimeGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "10px",
  },
  cancelBtn: {
    background: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 25px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tasksList: {
    marginTop: "30px",
  },
  taskItem: {
    background: "white",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  taskContent: {
    flex: 1,
    cursor: "pointer",
    paddingRight: "15px",
  },
  taskActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  completeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
    transition: "all 0.2s ease",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
    transition: "all 0.2s ease",
  },
  taskTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#495057",
    marginBottom: "8px",
  },
  taskTitleCompleted: {
    textDecoration: "line-through",
    color: "#6c757d",
  },
  taskDescription: {
    color: "#6c757d",
    marginBottom: "10px",
    lineHeight: 1.5,
  },
  taskDatetime: {
    color: "#667eea",
    fontWeight: 500,
    fontSize: "14px",
  },
};
