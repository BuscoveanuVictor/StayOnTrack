function renderTasks(tasks) {
const container = document.getElementById('tasksContainer');
container.innerHTML = '';
if (!tasks || tasks.length === 0) {
    container.innerHTML = '<div class="no-tasks">No tasks found.</div>';
    return;
}
tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task' + (task.completed ? ' completed' : '');
    div.innerHTML = `
    <span class="task-title">${task.title || '(no title)'}</span>
    <span class="task-date">${task.dueDate ? task.dueDate : ''}</span>
    `;
    container.appendChild(div);
});
}

// Citește din chrome.storage.sync
document.addEventListener('DOMContentLoaded', () => {
if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['taskList'], (data) => {
    renderTasks(data.taskList || []);
    });
} else {
    // fallback pentru test local
    renderTasks([
        {completed: false, title: "Test task", dueDate: "2025-08-20"},
        {completed: true, title: "Completed task", dueDate: "2025-08-19"}
    ]);
}
});


// Setează clasa pe body în funcție de mode-ul din chrome.storage.sync
if (chrome && chrome.storage && chrome.storage.sync) {
  chrome.storage.sync.get(['mode'], (data) => {
    if (data.mode === "allow") {
      document.body.classList.add('allow-mode');
    } else {
      document.body.classList.remove('allow-mode');
    }
  });
}