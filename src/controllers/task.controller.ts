import { Request, Response, NextFunction } from 'express';
import IServiceManager from '../services/interfaces/iserviceManager';
import { injectable, inject } from "inversify";
import TYPES from "../di/types";
import { TaskParameter } from '../helpers/ResourceParameter';
import { ValidatedRequest } from 'express-joi-validation'
import { 
    taskResourceSchema, 
    getTaskSchema,
    createTaskSchema, 
    updateTaskSchema
} from '../validators/task.validator';
import { resourceParameter } from '../helpers/constants';
import { LoggedInUser } from '../dtos/UserDTO';
import { 
    CreateTaskDTO, 
    UpdateTaskDTO
} from '../dtos/TaskDTO';

@injectable()
export default class TaskController {
    private _service: IServiceManager;

    constructor(@inject(TYPES.IServiceManager) service: IServiceManager) {
        this._service = service;
    }

    public async getAllTasks(req: ValidatedRequest<taskResourceSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const taskParameters : TaskParameter = req.query;
            taskParameters.pageNumber ??= resourceParameter.pageNumber;
            taskParameters.pageSize ??= resourceParameter.pageSize;
            const loggedInUser: LoggedInUser = req.user;
            const data = await this._service.Task.getAllTasks(taskParameters, loggedInUser);
            return res.status(data.status).json({data: data.data, meta: data.meta, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async createTask(req: ValidatedRequest<createTaskSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const createTaskDTO: CreateTaskDTO = req.body;
            const loggedInUser: LoggedInUser = req.user;
            const data = await this._service.Task.createTask(createTaskDTO, loggedInUser);
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async updateTask(req: ValidatedRequest<updateTaskSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const updateTaskDTO: UpdateTaskDTO = req.body;
            const loggedInUser: LoggedInUser = req.user;
            const data = await this._service.Task.updateTask(updateTaskDTO, +req.params.id, loggedInUser);
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async deleteTask(req: ValidatedRequest<getTaskSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const loggedInUser: LoggedInUser = req.user;
            const data = await this._service.Task.deleteTask(+req.params.id, loggedInUser);
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async getTask(req: ValidatedRequest<getTaskSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const loggedInUser: LoggedInUser = req.user;
            const data = await this._service.Task.getTask(+req.params.id, loggedInUser);
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }
}