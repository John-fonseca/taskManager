const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Ruta para leer tareas desde el archivo
const readTasks = () => {
  const data = fs.readFileSync("tasks.json");
  return JSON.parse(data);
};

// Ruta para guardar tareas en el archivo
const saveTasks = (tasks) => {
  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
};

// Rutas CRUD
// Crear una tarea
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: req.body.completed || false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).send(newTask);
});

// Leer todas las tareas
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.status(200).send(tasks);
});

// Actualizar una tarea
app.patch("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).send();
  }

  task.title = req.body.title !== undefined ? req.body.title : task.title;
  task.completed =
    req.body.completed !== undefined ? req.body.completed : task.completed;

  saveTasks(tasks);
  res.status(200).send(task);
});

// Eliminar una tarea
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).send();
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  saveTasks(tasks);
  res.status(200).send(deletedTask);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
