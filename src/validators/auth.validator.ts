import joi from 'joi';
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export const authValidator = {
    registerSchema: joi.object({
        email: joi.string().required(),
        username: joi.string().required(),
        password: joi.string().required()
    }),
    loginSchema: joi.object({
        password: joi.string().required(),
        user : joi.alternatives([
            joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).allow('_'),
            joi.string().email()
        ]).label('username or email as field user').required()
    }),
    refreshTokenSchema: joi.object({
        accessToken: joi.string().required(),
        refreshToken: joi.string().required()
    })
}

export interface registerSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {email: string, username: string, password: string}
}

export interface loginSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {user: string, password: string}
}

export interface refreshTokenSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {accessToken: string, refreshToken: string}
}