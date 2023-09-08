import joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export const taskValidator = {
    taskResourceSchema: joi.object({
        pageNumber: joi.number().min(1),
        pageSize: joi.number().min(1),
        search: joi.string()
    }),
    createTaskSchema: joi.object({
        title: joi.string().required(),
        description: joi.string().required()
    }),
    idParamsSchema: joi.object({
        id: joi.number().min(1).required()
    })
}

export interface taskResourceSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        pageNumber: number,
        pageSize: number,
        search: string
    }
}

export interface createTaskSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        title: string,
        description: string
    }
}

export interface updateTaskSchema extends createTaskSchema{
    [ContainerTypes.Params]: {id: string}
};

export interface getTaskSchema extends ValidatedRequestSchema{
    [ContainerTypes.Params]: {id: string}
};