import { addTask } from "./tasks.js";

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
    const taskText = document.createElement("span");

    listItem.className = "task-item";
    taskText.className = "task-item__text";

    taskText.textContent = task.text;

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

renderTasks();