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