import { AutoMap } from '@automapper/classes'

export class CreateTaskDTO {
    @AutoMap()
    public title: string

    @AutoMap()
    public description: string
};

export class UpdateTaskDTO extends CreateTaskDTO {}

export class TaskResponse {
    @AutoMap()
    public id: number;

    @AutoMap()
    public title: string

    @AutoMap()
    public description: string

    @AutoMap()
    public userId: number
};