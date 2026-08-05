import { addTask, toggleTask } from "./tasks.js";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const formError = document.getElementById("formError");

let tasks = [];

function showError(message) {
  formError.textContent = message;
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const taskText = document.createElement("span");

    listItem.className = "task-item";
    listItem.dataset.taskId = task.id;

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "task-item__check";
    checkbox.dataset.action = "toggle";

    taskText.className = "task-item__text";
    taskText.textContent = task.text;

    if (task.completed) {
      listItem.classList.add("is-completed");
    }

    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    taskList.appendChild(listItem);
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = addTask(tasks, taskInput.value);

  if (result.error) {
    showError(result.error);
    taskInput.focus();
    return;
  }

  tasks = result.tasks;
  taskInput.value = "";

  showError("");
  renderTasks();
});

taskInput.addEventListener("input", () => {
  if (formError.textContent) {
    showError("");
  }
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target;

  if (checkbox.dataset.action !== "toggle") {
    return;
  }

  const listItem = checkbox.closest("[data-task-id]");

  if (!listItem) {
    return;
  }

  const taskId = listItem.dataset.taskId;

  tasks = toggleTask(tasks, taskId);

  renderTasks();
});

renderTasks();