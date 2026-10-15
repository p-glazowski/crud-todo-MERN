const Task = require('../models/task');
const asyncWrapper = require('../middleware/asyncWrapper');

/* async function getAllTasks(req, res) {
  try {
    const tasks = await Task.find();

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
      error: err.message,
    });
  }
} */

async function getAllTasks(req, res) {
  const tasks = await Task.find();

  return res.status(200).json({ success: true, data: tasks });
}

/* async function getTaskById(req, res) {
  try {
    const { taskId } = req.params;
    const foundTask = await Task.findById(taskId);

    if (!foundTask) {
      return res.status(404).json({
        success: false,
        errorMsg: `Cannot find a task with id ${taskId}`,
      });
    }

    return res.status(200).json({ success: true, data: foundTask });
  } catch (err) {
    return res.status(400).json({
      success: false,
      errorMsg: 'Failed to fetch task by id',
      error: err,
    });
  }
} */

async function getTaskById(req, res, next) {
  const { taskId } = req.params;
  const foundTask = await Task.findById(taskId);

  if (!foundTask) {
    //const error = new Error(`Cannot find task with id ${taskId}`);
    //error.status = 404;
    //return next(error);
    return res
      .status(404)
      .json({ success: false, errorMsg: `Cannot find task with id ${taskId}` });
  }
  return res.status(200).json({ success: true, data: foundTask });
}

async function createTask(req, res) {
  try {
    const { title } = req.body;

    /*     if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    } */

    const task = await Task.create({ title });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: err.message,
    });
  }
}

async function deleteTaskById(req, res) {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        errorMsg: `Cannot find task with id ${taskId}`,
      });
    }
    return res.status(200).json({ success: true, data: deletedTask });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errorMsg: `Cannot delete the task`, error: err });
  }
}

async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    const { title, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res
          .status(400)
          .json({ success: false, errorMsg: `Title must be non empty string` });
      }

      updates.title = title;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res
          .status(400)
          .json({ success: false, errorMsg: `Completed must be a boolean` });
      }

      updates.completed = completed;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: updates,
      },
      { returnDocument: 'after', runValidators: true },
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        errorMsg: `Cannot find task with id ${taskId}`,
      });
    }

    return res.status(200).json({ success: true, data: updatedTask });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, errorMsg: 'Failed to update task', error: err });
  }
}

module.exports = {
  getAllTasks: asyncWrapper(getAllTasks),
  createTask,
  updateTask,
  getTaskById: asyncWrapper(getTaskById),
  deleteTaskById,
};
