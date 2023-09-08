import { AutoMap } from '@automapper/classes'
import { Model } from "sequelize";

export class Task extends Model{
    @AutoMap()
    id: number;

    @AutoMap()
    title: string;

    @AutoMap()
    description: string;

    @AutoMap()
    userId: number;
}