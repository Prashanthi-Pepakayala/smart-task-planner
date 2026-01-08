const input = document.querySelector("input");
const select = document.querySelector("select");
const button = document.querySelector("button");
const taskList = document.querySelector(".task-list");

const API_URL = "https://smart-task-planner-2-8w3g.onrender.com/tasks";

// ===== FETCH & RENDER =====
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add(task.priority);
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.innerText = task.title;

    // Toggle completed
    span.addEventListener("click", async () => {
      await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      loadTasks();
    });

    // Delete task
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Remove";

    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
      loadTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// ===== ADD TASK (FIXED) =====
button.addEventListener("click", async (e) => {
  e.preventDefault(); // 🔥 THIS FIXES EVERYTHING

  if (input.value.trim() === "") return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: input.value,
      priority: select.value,
      completed: false
    })
  });

  input.value = "";
  loadTasks();
});

// ===== INITIAL LOAD =====
loadTasks();
