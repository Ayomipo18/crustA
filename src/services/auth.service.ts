import IAuthService from './interfaces/iauth.service';
import axios from 'axios';
import { injectable, inject } from "inversify";
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import SuccessResponse from '../helpers/successResponse';
import logger from "../logger";
import { HttpException } from '../exceptions/HttpException'
import { oauth2Client, profileURL, jwt_secret } from '../config/config'
import { OAuthProvider, jwtDetails } from '../helpers/constants'
import { GetGoogleUser, UserLoginResponse } from '../dtos/UserDTO';
import { mapper } from '../mappings/mapper';
import { User } from '../models/interfaces/iuser.model';
import { UserModel } from '../models/user.model';
import { AuthDTO, AuthUrlResponse, AuthTokenDTO, AuthTokenResponse, CreateUserDTO, LoginUserDTO } from '../dtos/AuthDTO';
import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid'

@injectable()
export default class AuthService implements IAuthService {
    private _user = UserModel;

    constructor() {}
    
    public async register(input: CreateUserDTO): Promise<SuccessResponse<UserLoginResponse>> {
        const userExists = await this._user.findOne({ where : {[Op.or] : [ { email: input.email }, { username: input.username } ] }});
        if(userExists) {
            //if it was email that matched
            if(userExists.email === input.email) throw new HttpException(StatusCodes.BAD_REQUEST, 'User with email exists');
            //else throw username error
            throw new HttpException(StatusCodes.BAD_REQUEST, 'User with username exists');
        }

        const user = await this._user.create({username: input.username, email: input.email, password: input.password})

        const token = await this.generateToken(user, true);
        const userLoginResponseDto = mapper.map(user, User, UserLoginResponse);

        userLoginResponseDto.refreshToken = token.refreshToken;
        userLoginResponseDto.accessToken = token.accessToken;

        return new SuccessResponse<UserLoginResponse>(StatusCodes.OK, 'User registration successful', userLoginResponseDto);
    }

    public async login(input: LoginUserDTO): Promise<SuccessResponse<UserLoginResponse>> {
        const user = await this._user.findOne({ where : { [Op.or] :  [{username : input.user}, { email : input.user }] } });
        if(!user) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    
        if(user.oauthLogin) throw new HttpException(StatusCodes.BAD_REQUEST, 'This requires a social login')

        const validPassword = await user.validatePassword(input.password);
        if(!validPassword) throw new HttpException(StatusCodes.BAD_REQUEST, 'Wrong login details')

        const token = await this.generateToken(user, true);
        const userLoginResponseDto = mapper.map(user, User, UserLoginResponse);

        userLoginResponseDto.refreshToken = token.refreshToken;
        userLoginResponseDto.accessToken = token.accessToken;

        return new SuccessResponse<UserLoginResponse>(StatusCodes.OK, 'User registration successful', userLoginResponseDto);
    }

    public async authorize(): Promise<SuccessResponse<AuthUrlResponse>> {
        try {
            // Access scopes for read/write google user email, profile and calendar activity.
            const scopes = [
                'email', 
                'profile'
            ];

            // Generate a url that asks permissions for the calendar activity scope
            const url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
                prompt: 'consent'
            });

            return new SuccessResponse<AuthUrlResponse>(StatusCodes.OK, "Paste this link in your browser to authorize CalendarA", url)
        } catch (error) {
            logger.error(`Error generating url:: ${error}`);
            throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
        }
    }

    public async getGoogleUser(inputCode: AuthDTO): Promise<SuccessResponse<UserLoginResponse>> {
        if (!inputCode) throw new HttpException(StatusCodes.UNAUTHORIZED, 'You are not authorized to access this endpoint.');

        const googleUser = await this.getGUser(inputCode.code!);
        console.log(googleUser.data)
        const { email, given_name, family_name } = googleUser.data;

        let user = await this._user.findOne({where: {email}});
        
        if(!user) {
            user = await this._user.create({
                username: `_${given_name}${family_name}`, 
                email: email, 
                passowrd: '', 
                oauthLogin: true, 
                oauthProvider: OAuthProvider.google
            });
        }
        
        const token = await this.generateToken(user, true);
        const userLoginResponseDto = mapper.map(user, User, UserLoginResponse);

        userLoginResponseDto.refreshToken = token.refreshToken;
        userLoginResponseDto.accessToken = token.accessToken;

        return new SuccessResponse<UserLoginResponse>(StatusCodes.OK, 'Google Authorization completed', userLoginResponseDto)
    }

    public async refreshToken(token: AuthTokenDTO): Promise<SuccessResponse<AuthTokenResponse>> {
        let newToken : AuthTokenResponse = new AuthTokenResponse();
        try {
            jwt.verify(token.accessToken, jwt_secret!, 
                {audience: jwtDetails.audience, issuer: jwtDetails.issuer})
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                const decoded: any = jwt.verify(token.accessToken, jwt_secret!, 
                    {audience: jwtDetails.audience, issuer: jwtDetails.issuer, ignoreExpiration: true})

                const user = await this._user.findByPk(decoded.id);
                if(!user || token.refreshToken !== user.refreshToken || user.refreshTokenExpiryTime < new Date() ) {
                    throw new HttpException(StatusCodes.BAD_REQUEST, 'Bad token')
                }
                
                newToken = await this.generateToken(user, false);
            } else{
                throw new HttpException(StatusCodes.BAD_REQUEST, 'This token has expired, please login')
            }
        }
        return new SuccessResponse<AuthTokenResponse>(StatusCodes.OK, 'Token refreshed successfully', newToken);
    }

    private async getGUser(code: string): Promise<GetGoogleUser> {
        try {
            const { tokens } = await oauth2Client.getToken(code)
            oauth2Client.setCredentials({
                refresh_token: tokens.refresh_token
            });
    
            const googleUser = await axios.get(
                `${profileURL}${tokens.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`,
                    },
                },
            )

            return { data: googleUser.data, refreshToken: tokens.refresh_token }
        } catch (error) {
            logger.error(`Error from Getting User email and profile:: ${error}`);
            throw new HttpException(StatusCodes.BAD_REQUEST, 'Bad request')
        }
    }

    private async generateToken(user: User, populate: boolean): Promise<AuthTokenResponse> {
        const tokenDetails = {
            id: user.id,
            email: user.email
        }
        const accessToken = jwt.sign(tokenDetails, jwt_secret!, jwtDetails);
        const refreshToken = nanoid();

        user.refreshToken = refreshToken;
        if(populate) {
            user.refreshTokenExpiryTime = new Date();
            user.refreshTokenExpiryTime.setDate(user.refreshTokenExpiryTime.getDate() + 7);
        }

        await user.save();

        const token = new AuthTokenResponse();
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;

        return token;
    }
}