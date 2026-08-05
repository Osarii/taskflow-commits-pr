const MAX_TASK_LENGTH = 120;

export function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

export function validateTaskText(value) {
  const text = normalizeText(value);

  if (!text) {
    return {
      valid: false,
      error: "Escribe una tarea antes de agregarla."
    };
  }

  if (text.length < 3) {
    return {
      valid: false,
      error: "La tarea debe tener al menos 3 caracteres."
    };
  }

  if (text.length > MAX_TASK_LENGTH) {
    return {
      valid: false,
      error: `La tarea no puede superar ${MAX_TASK_LENGTH} caracteres.`
    };
  }

  return {
    valid: true,
    error: "",
    text
  };
}

function generateId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTask(
  value,
  id = generateId(),
  createdAt = new Date().toISOString()
) {
  const validation = validateTaskText(value);

  if (!validation.valid) {
    return {
      task: null,
      error: validation.error
    };
  }

  return {
    task: {
      id,
      text: validation.text,
      completed: false,
      createdAt
    },
    error: ""
  };
}

export function addTask(tasks, value) {
  const result = createTask(value);

  if (!result.task) {
    return {
      tasks: [...tasks],
      task: null,
      error: result.error
    };
  }

  return {
    tasks: [result.task, ...tasks],
    task: result.task,
    error: ""
  };
}
export function toggleTask(tasks, taskId) {
  return tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      completed: !task.completed
    };
  });
}
export function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}
export function editTask(tasks, taskId, value) {
  const validation = validateTaskText(value);

  if (!validation.valid) {
    return {
      tasks: [...tasks],
      error: validation.error
    };
  }

  const updatedTasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      text: validation.text
    };
  });

  return {
    tasks: updatedTasks,
    error: ""
  };
export function filterTasks(tasks, filter) {
  if (filter === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  if (filter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return [...tasks];
}
}