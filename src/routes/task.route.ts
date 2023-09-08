import 'reflect-metadata';
import container from '../di/inversify.config';
import { Router } from 'express';
import TaskController from '../controllers/task.controller';
import validator from '../validators';
import { isLoggedIn } from '../middlewares/auth.middleware';
import { taskValidator } from '../validators/task.validator';

const taskController: TaskController = container.resolve(TaskController);

const taskRouter = Router();

taskRouter.post(
    '/',
    isLoggedIn,
    validator.body(taskValidator.createTaskSchema),
    taskController.createTask.bind(taskController)
)

taskRouter.put(
    '/:id',
    isLoggedIn,
    validator.params(taskValidator.idParamsSchema),
    validator.body(taskValidator.createTaskSchema),
    taskController.updateTask.bind(taskController)
)

taskRouter.delete(
    '/:id',
    isLoggedIn,
    validator.params(taskValidator.idParamsSchema),
    taskController.deleteTask.bind(taskController)
)

taskRouter.get(
    '/:id',
    isLoggedIn,
    validator.params(taskValidator.idParamsSchema),
    taskController.getTask.bind(taskController)
)

taskRouter.get(
    '/',
    isLoggedIn,
    validator.query(taskValidator.taskResourceSchema),
    taskController.getAllTasks.bind(taskController)
)

export default taskRouter;