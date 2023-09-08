import ITaskService from './interfaces/itask.service';
import { injectable, inject } from "inversify";
import { HttpException } from '../exceptions/HttpException';
import SuccessResponse from '../helpers/successResponse';
import { PagedResponse, Meta } from '../helpers/PagedResponse';
import { mapper } from '../mappings/mapper';
import { Task } from '../models/interfaces/itask.model';
import { TaskResponse, UpdateTaskDTO, CreateTaskDTO } from '../dtos/TaskDTO';
import { TaskParameter } from '../helpers/ResourceParameter';
import { LoggedInUser } from '../dtos/UserDTO';
import { StatusCodes } from 'http-status-codes';
import { TaskModel } from '../models/task.model';
import { Op } from 'sequelize';

@injectable()
export default class TaskService implements ITaskService {
    private _task = TaskModel;

    constructor() {}

    public async getAllTasks(taskParameters: TaskParameter, loggedInUser: LoggedInUser): Promise<PagedResponse<Array<TaskResponse>>> {
        let tasks;
        let count;

        if(taskParameters.search) {
            count = await this._task.count({
                where: {
                    userId: loggedInUser.id,
                    [Op.or]: [{title: {[Op.like]: `%${taskParameters.search}%`}}, {description: {[Op.like]: `%${taskParameters.search}%`}}]
                }
            });
            tasks = await this._task.findAll({
                where: {
                    userId: loggedInUser.id,
                    [Op.or]: [{title: {[Op.like]: `%${taskParameters.search}%`}}, {description: {[Op.like]: `%${taskParameters.search}%`}}]
                },
                limit: taskParameters.pageSize,
                offset: taskParameters.pageSize * (taskParameters.pageNumber - 1)
            });
        } else {
            count = await this._task.count({
                where: {
                    userId: loggedInUser.id,
                    [Op.or]: [{title: {[Op.like]: `%${taskParameters.search}%`}}, {description: {[Op.like]: `%${taskParameters.search}%`}}]
                }
            });
            tasks = await this._task.findAll({
                where: {
                    userId: loggedInUser.id
                },
                limit: taskParameters.pageSize,
                offset: taskParameters.pageSize * (taskParameters.pageNumber - 1)
            });
        }

        const totalPages = Math.ceil(count / taskParameters.pageSize);
        const nextPage = taskParameters.pageNumber < totalPages ? taskParameters.pageNumber + 1: null
        const previousPage = (taskParameters.pageNumber > 1 && taskParameters.pageNumber <= totalPages) 
        ? taskParameters.pageNumber - 1: null
        const meta = new Meta(nextPage, previousPage, totalPages, taskParameters.pageSize, count);

        const tasksResponseDto = mapper.mapArray(tasks, Task, TaskResponse);

        return new PagedResponse<Array<TaskResponse>>(StatusCodes.OK, 'Tasks returned succesfully', tasksResponseDto, meta)
    }

    public async createTask(createTaskDTO: CreateTaskDTO, loggedInUser: LoggedInUser): Promise<SuccessResponse<TaskResponse>> {
        const model = mapper.map(createTaskDTO, CreateTaskDTO, Task)

        const task = await this._task.create({
            title: model.dataValues.title, 
            description: model.dataValues.description,
            userId: loggedInUser.id
        });

        const taskResponseDto = mapper.map(task, Task, TaskResponse);
        return new SuccessResponse<TaskResponse>(StatusCodes.CREATED, 'Task created successfully', taskResponseDto)
    }

    public async updateTask(updateTaskDTO: UpdateTaskDTO, id: number, loggedInUser: LoggedInUser): Promise<SuccessResponse<TaskResponse>> {
        const task = await this._task.findOne({where: {
            id: id, userId: loggedInUser.id
        }});
        if (!task) throw new HttpException(StatusCodes.NOT_FOUND, 'Task does not exist');

        mapper.mutate(updateTaskDTO, task, UpdateTaskDTO, Task)
        await task.save()

        const taskResponseDto = mapper.map(task, Task, TaskResponse);
        return new SuccessResponse<TaskResponse>(StatusCodes.OK, 'Task updated successfully', taskResponseDto)
    }

    public async deleteTask(id: number, loggedInUser: LoggedInUser): Promise<SuccessResponse<null>> {
        const deleteResult = await this._task.destroy({where: {
            id: id, userId: loggedInUser.id
        }})

        if (deleteResult < 1) {
            throw new HttpException(StatusCodes.NOT_FOUND, 'Task does not exist');
        }

        return new SuccessResponse<null>(StatusCodes.NO_CONTENT, 'Task deleted successfully', null)
    }

    public async getTask(id: number, loggedInUser: LoggedInUser): Promise<SuccessResponse<TaskResponse>> {
        const task = await this._task.findOne({where: {
            id: id, userId: loggedInUser.id
        }})

        if(!task) throw new HttpException(StatusCodes.NOT_FOUND, 'Task does not exist');

        const TaskResponseDto = mapper.map(task, Task, TaskResponse);
        return new SuccessResponse<TaskResponse>(StatusCodes.OK, 'Task returned successfully', TaskResponseDto)
    }
}