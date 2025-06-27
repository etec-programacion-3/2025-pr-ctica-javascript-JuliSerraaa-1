// Importa las funciones del módulo de tareas (incluyendo updateTask)
import { getTasks, addTask, removeTask, updateTask } from './tareas.js';

// Referencias a los elementos del DOM usando destructuring
const elements = {
  form: document.getElementById('task-form'),
  input: document.getElementById('task-input'),
  list: document.getElementById('task-list'),
  filterSelect: document.getElementById('filter-select')
};
const { form, input, list, filterSelect } = elements;

// Estado actual del filtro (por defecto, muestra todas las tareas)
let currentFilter = 'all';

// Función para renderizar la lista de tareas en el DOM
function renderTasks() {
  list.innerHTML = ''; // Limpia la lista actual

  const allTasks = getTasks();

  // Filtra las tareas según el filtro seleccionado usando destructuring en el parámetro de la función
  const filteredTasks = allTasks.filter(({ completed }) => {
    switch (currentFilter) {
      case 'completed':
        return completed;
      case 'pending':
        return !completed;
      default: // 'all'
        return true;
    }
  });

  filteredTasks.forEach(task => {
    // Usamos el índice original de la tarea. Esto es crucial porque 'filteredTasks'
    // puede tener un orden e índices diferentes a 'allTasks'.
    const actualIndex = allTasks.findIndex(t => t === task);

    const li = document.createElement('li');

    // Checkbox para marcar como completada
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      // Usa el spread operator para actualizar solo la propiedad 'completed'
      updateTask(actualIndex, { ...task, completed: !task.completed });
      renderTasks();
    };
    li.appendChild(checkbox);

    // Contenedor para el texto de la tarea
    const taskContent = document.createElement('span');
    taskContent.textContent = task.text;
    if (task.completed) {
      taskContent.classList.add('completed-task');
    }
    li.appendChild(taskContent);

    // Botón para editar la tarea
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = task.text;

      li.replaceChild(editInput, taskContent);
      editInput.focus();

      // Función auxiliar para guardar la edición
      const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText !== '' && newText !== task.text) {
          updateTask(actualIndex, { ...task, text: newText }); // Actualiza solo el texto
        }
        renderTasks(); // Vuelve a renderizar
      };

      editInput.addEventListener('keyup', ({ key }) => { // Destructuring para 'key'
        if (key === 'Enter') {
          saveEdit();
        }
      });

      editInput.addEventListener('blur', saveEdit); // Guardar al perder el foco

      editBtn.style.display = 'none';
      removeBtn.style.display = 'none'; // Asegúrate de que removeBtn esté definida
    };
    li.appendChild(editBtn);

    // Botón para eliminar la tarea
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.classList.add('delete-btn');
    removeBtn.onclick = () => {
      removeTask(actualIndex);
      renderTasks();
    };
    li.appendChild(removeBtn);

    list.appendChild(li);
  });
}

// Maneja el evento submit del formulario para agregar una tarea
form.onsubmit = e => {
  e.preventDefault(); // Evita que la página se recargue
  const taskText = input.value.trim();
  if (taskText) { // Equivalente a taskText !== ''
    addTask(taskText);
    input.value = ''; // Limpia el input
    renderTasks(); // Renderiza la lista actualizada
  }
};

// Maneja el evento change del select para filtrar tareas
filterSelect.onchange = ({ target: { value } }) => { // Destructuring para obtener 'value' directamente
  currentFilter = value;
  renderTasks();
};

// Render inicial de las tareas cuando la página carga
renderTasks();