import {
  addTask,
  toggleTask,
  removeTask,
  editTask,
  filterTasks
} from "./tasks.js";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const formError = document.getElementById("formError");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = [];
let editingTaskId = null;
let currentFilter = "all";

function showError(message) {
  formError.textContent = message;
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;

    button.classList.toggle("is-active", isActive);
  });
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = filterTasks(tasks, currentFilter);

  if (visibleTasks.length === 0) {
    emptyState.hidden = false;
    updateFilterButtons();
    return;
  }

  emptyState.hidden = true;

  visibleTasks.forEach((task) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");

    listItem.className = "task-item";
    listItem.dataset.taskId = task.id;

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "task-item__check";
    checkbox.dataset.action = "toggle";

    if (task.completed) {
      listItem.classList.add("is-completed");
    }

    listItem.appendChild(checkbox);

    if (editingTaskId === task.id) {
      const editInput = document.createElement("input");
      const saveButton = document.createElement("button");
      const cancelButton = document.createElement("button");

      editInput.type = "text";
      editInput.value = task.text;
      editInput.maxLength = 120;
      editInput.className = "task-item__edit-input";

      saveButton.type = "button";
      saveButton.textContent = "Guardar";
      saveButton.dataset.action = "save";
      saveButton.className = "task-item__save";

      cancelButton.type = "button";
      cancelButton.textContent = "Cancelar";
      cancelButton.dataset.action = "cancel";
      cancelButton.className = "task-item__cancel";

      listItem.appendChild(editInput);
      listItem.appendChild(saveButton);
      listItem.appendChild(cancelButton);
    } else {
      const taskText = document.createElement("span");
      const editButton = document.createElement("button");
      const deleteButton = document.createElement("button");

      taskText.className = "task-item__text";
      taskText.textContent = task.text;

      editButton.type = "button";
      editButton.textContent = "Editar";
      editButton.dataset.action = "edit";
      editButton.className = "task-item__edit";

      deleteButton.type = "button";
      deleteButton.textContent = "Eliminar";
      deleteButton.dataset.action = "delete";
      deleteButton.className = "task-item__delete";

      listItem.appendChild(taskText);
      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);
    }

    taskList.appendChild(listItem);
  });

  updateFilterButtons();
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

  tasks = toggleTask(tasks, listItem.dataset.taskId);

  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const button = event.target;

  if (!button.dataset.action) {
    return;
  }

  const listItem = button.closest("[data-task-id]");

  if (!listItem) {
    return;
  }

  const taskId = listItem.dataset.taskId;
  const action = button.dataset.action;

  if (action === "delete") {
    tasks = removeTask(tasks, taskId);
    editingTaskId = null;
    renderTasks();
    return;
  }

  if (action === "edit") {
    editingTaskId = taskId;
    showError("");
    renderTasks();

    const editInput = document.querySelector(
      `[data-task-id="${taskId}"] .task-item__edit-input`
    );

    if (editInput) {
      editInput.focus();
      editInput.select();
    }

    return;
  }

  if (action === "cancel") {
    editingTaskId = null;
    showError("");
    renderTasks();
    return;
  }

  if (action === "save") {
    const editInput = listItem.querySelector(
      ".task-item__edit-input"
    );

    const result = editTask(
      tasks,
      taskId,
      editInput.value
    );

    if (result.error) {
      showError(result.error);
      editInput.focus();
      return;
    }

    tasks = result.tasks;
    editingTaskId = null;

    showError("");
    renderTasks();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    editingTaskId = null;

    renderTasks();
  });
});

renderTasks();