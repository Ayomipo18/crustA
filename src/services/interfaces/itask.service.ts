import { PagedResponse } from "../../helpers/PagedResponse";
import { TaskResponse, CreateTaskDTO, UpdateTaskDTO } from "../../dtos/TaskDTO";
import { TaskParameter } from "../../helpers/ResourceParameter";
import { LoggedInUser } from "../../dtos/UserDTO";
import SuccessResponse from "../../helpers/successResponse";

export default interface ITaskService {
    getAllTasks(taskParameters: TaskParameter, loggedInUser: LoggedInUser): Promise<PagedResponse<Array<TaskResponse>>>;
    createTask(createTaskDTO: CreateTaskDTO, loggedInUser: LoggedInUser): Promise<SuccessResponse<TaskResponse>>
    updateTask(updateTaskDTO: UpdateTaskDTO, id: number, loggedInUser: LoggedInUser): Promise<SuccessResponse<TaskResponse>>
    deleteTask(id: number, loggedInUser: LoggedInUser): Promise<SuccessResponse<null>>
    getTask(id: number, loggedInUser: LoggedInUser): Promise<SuccessResponse<TaskResponse>>
}