// Módulo de tareas usando ES6+
// Provee funciones para obtener, agregar, eliminar y actualizar tareas usando localStorage

const STORAGE_KEY = 'tasks'; // Clave para localStorage

// Devuelve la lista de tareas almacenadas
export function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Agrega una tarea nueva y la guarda en localStorage
// Ahora recibe el texto y crea un objeto de tarea con estado 'completed: false'
export function addTask(text) {
  const tasks = getTasks();
  tasks.push({ text, completed: false }); // Uso de shorthand property name
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Elimina una tarea por índice y actualiza localStorage
export function removeTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Nueva función para actualizar una tarea existente
// Utiliza destructuring para newData y spread para fusionar propiedades
export function updateTask(index, newData) {
  const tasks = getTasks();
  if (tasks[index]) {
    // Usa spread operator (...) para crear una nueva tarea con las propiedades actualizadas
    tasks[index] = { ...tasks[index], ...newData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}