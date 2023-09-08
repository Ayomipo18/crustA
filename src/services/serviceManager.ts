import { injectable } from "inversify";
import lazyInject from "../di/decorators";
import IServiceManager from "./interfaces/iserviceManager";
import IAuthService from "./interfaces/iauth.service";
import ITaskService from "./interfaces/itask.service";
import TYPES from "../di/types";

@injectable()
export default class ServiceManager implements IServiceManager{

    @lazyInject(TYPES.IAuthService)
    private _authService: IAuthService;

    @lazyInject(TYPES.ITaskService)
    private _taskService: ITaskService;

    public get Auth (): IAuthService {
        return this._authService;
    }

    public get Task (): ITaskService {
        return this._taskService;
    }

}