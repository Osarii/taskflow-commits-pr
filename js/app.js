import { addTask } from "./tasks.js";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

let tasks = [];

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = addTask(tasks, taskInput.value);

  if (result.error) {
    console.error(result.error);
    return;
  }

  tasks = result.tasks;
  taskInput.value = "";

  console.log(tasks);
});