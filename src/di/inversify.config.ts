import container from "./container";
import TYPES from "./types";

import IAuthService from "../services/interfaces/iauth.service";
import ITaskService from "../services/interfaces/itask.service";
import IServiceManager from "../services/interfaces/iserviceManager";

import AuthService from "../services/auth.service";
import TaskService from "../services/task.service";
import ServiceManager from "../services/serviceManager";

container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<ITaskService>(TYPES.ITaskService).to(TaskService);
container.bind<IServiceManager>(TYPES.IServiceManager).to(ServiceManager);

export default container;