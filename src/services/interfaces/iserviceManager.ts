import IAuthService from "./iauth.service";
import ITaskService from "./itask.service";

export default interface IServiceManager {
    Auth: IAuthService;
    Task: ITaskService;
}