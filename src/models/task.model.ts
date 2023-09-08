import { DataTypes } from "sequelize";
import { Task } from './interfaces/itask.model'
import sequelize from "../config/db";
import { User } from "./interfaces/iuser.model";

export const TaskModel = Task.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER
      }
}, {
    tableName: 'tasks',
    sequelize: sequelize,
    timestamps: true
})

Task.belongsTo(User, {
    foreignKey : 'userId'
});