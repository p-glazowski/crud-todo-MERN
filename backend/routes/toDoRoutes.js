const express = require('express');
const routes = express.Router();
const toDoController = require('../controllers/toDoController');

routes.get('/', toDoController.getAllTasks);
routes.get('/:taskId', toDoController.getTaskById);
routes.post('/', toDoController.createTask);
routes.delete('/:taskId', toDoController.deleteTaskById);
routes.patch('/:taskId', toDoController.updateTask);

module.exports = routes;
