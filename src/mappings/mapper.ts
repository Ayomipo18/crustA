import { createMapper, createMap, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { User } from '../models/interfaces/iuser.model';
import { UserLoginResponse } from '../dtos/UserDTO';
import { Task } from '../models/interfaces/itask.model';
import { CreateTaskDTO, TaskResponse, UpdateTaskDTO } from '../dtos/TaskDTO';

// Create and export the mapper
export const mapper = createMapper({
    strategyInitializer: classes(),
});

createMap(mapper, User, UserLoginResponse);
createMap(mapper, CreateTaskDTO, Task);
createMap(mapper, UpdateTaskDTO, Task);
createMap(mapper, Task, TaskResponse);
