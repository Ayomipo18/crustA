import { Request, Response, NextFunction } from 'express';
import IServiceManager from '../services/interfaces/iserviceManager';
import { injectable, inject } from "inversify";
import TYPES from "../di/types";
import { AuthDTO } from '../dtos/AuthDTO';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import { ValidatedRequest } from 'express-joi-validation';

@injectable()
export default class AuthController {
    private _service: IServiceManager;

    constructor(@inject(TYPES.IServiceManager) service: IServiceManager) {
        this._service = service;
    }

    public async register(req: ValidatedRequest<registerSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const input = req.body;
            const data = await this._service.Auth.register(input);
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async login(req: ValidatedRequest<loginSchema>, res: Response, next: NextFunction): Promise<any>{
        try {
            const input = req.body;
            const data = await this._service.Auth.login(input);
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async authorize(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const data = await this._service.Auth.authorize();
            return res.status(data.status).json({data: data.data, message: data.message});
        } catch(error) {
            next(error);
        }
    }

    public async getGoogleUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const code: AuthDTO = req.query;
            const data = await this._service.Auth.getGoogleUser(code);
            return res.status(data.status).json({data: data.data, message: data.message});
        }catch (error) {
            next(error);
        }
    }

    public async refreshToken(req: ValidatedRequest<refreshTokenSchema>, res: Response, next: NextFunction): Promise<any> {
        try {
            const token = req.body;
            const data = await this._service.Auth.refreshToken(token);
            return res.status(data.status).json({data: data.data, message: data.message});
        }catch (error) {
            next(error);
        }
    }
}